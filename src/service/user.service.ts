import jwt from "jsonwebtoken";
import ServiceError from "../core/serviceError";
import { prisma } from "../data";
import { hashPassword, verifyPassword } from "../core/password";
import { generateJWT, verifyJWT } from "../core/jwt";
import { getLogger } from "../core/logging";
import Role from "../core/roles";
import type { User, UserCreateInput, UserUpdateInput, PublicUser, PublicUserWithWallets } from "../types/user.types";
import type { SessionInfo } from "../types/auth.types";
import handleDBError from "./_handleDBError";
import type { 
  PublicSavedWallet, 
  PublicSavedWalletWithBalance, 
  SavedWalletCreateInput, 
} from "../types/savedWallet.types";
import { calculateBalance } from "../utils/calculateBalance";

const makeExposedUser = ({ id, name, email }: User): PublicUser => ({ id, name, email });

export const register = async ({ name, email, password }: UserCreateInput): Promise<string> => {
  try {
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, password_hash: passwordHash, roles: [Role.USER]},
    });

    return await generateJWT(user);
  } catch (error) {
    throw handleDBError(error);
  }
};

export const login = async (email: string, password: string): Promise<string> => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw ServiceError.unauthorized("The given email and password do not match.");
  }

  const passwordValid = await verifyPassword(password, user.password_hash);

  if (!passwordValid) {
    throw ServiceError.unauthorized("The given email and password do not match.");
  }

  return await generateJWT(user);
};

export const getAll = async (): Promise<PublicUser[]> => {
  const users = await prisma.user.findMany();
  return users.map(makeExposedUser);
};

export const getById = async (id: string): Promise<PublicUserWithWallets> => {
  const user = await prisma.user.findUnique({ where: { id }, include:{wallets:{select:{id:true, address:true}}} });

  if (!user) {
    throw ServiceError.notFound("No user with this id exists.");
  }
  const walletsWithBalances = await Promise.all(
    user.wallets.map(async (wallet) => {
      const balance = await calculateBalance(wallet.address);
      return { ...wallet, balance };
    }),
  );

  const exposedUser =  makeExposedUser(user);
  return {...exposedUser, wallets: walletsWithBalances};

};

export const updateById = async (id: string, changes: UserUpdateInput): Promise<PublicUser> => {
  try {
    const user = await prisma.user.update({ where: { id }, data: changes });
    return makeExposedUser(user);
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: string): Promise<void> => {
  try {
    await prisma.user.delete({ where: { id } });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const checkAndParseSession = async (authHeader?: string): Promise<SessionInfo> => {
  if (!authHeader) {
    throw ServiceError.unauthorized("You need to be signed in.");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw ServiceError.unauthorized("Invalid authentication token.");
  }

  const authToken = authHeader.substring(7);

  try {
    const { roles, sub } = await verifyJWT(authToken);

    return { userId: sub || "", roles };
  } catch (error: any) {
    getLogger().error(error.message, { error });

    if (error instanceof jwt.TokenExpiredError) {
      throw ServiceError.unauthorized("The token has expired.");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw ServiceError.unauthorized(`Invalid authentication token: ${error.message}`);
    } else {
      throw ServiceError.unauthorized(error.message);
    }
  }
};

export const checkRole = (role: string, roles: string[]): void => {
  const hasPermission = roles.includes(role);

  if (!hasPermission) {
    throw ServiceError.forbidden("You are not allowed to view this part of the application.");
  }
};

export const saveWallet = async (
  userId: string, { walletId, alias}: SavedWalletCreateInput,
): Promise<PublicSavedWalletWithBalance> => {
  try {
    const existingSavedWallet = await prisma.savedWallet.findFirst({
      where: { userId: userId, walletId: walletId },
    });

    if (existingSavedWallet) {
      throw ServiceError.conflict("This wallet is already saved.");
    }

    const savedWallet = await prisma.savedWallet.create({
      data: { alias: alias, userId: userId, walletId: walletId},
      select:{id:true, alias:true, wallet:{select:{address:true}}},
    });

    const balance = await calculateBalance(savedWallet.wallet.address);

    return {
      id: savedWallet.id,
      alias: savedWallet.alias,
      wallet: {
        address: savedWallet.wallet.address,
        balance,
      },
    };
  } catch (error) {
    throw handleDBError(error);
  }
};

export const getSavedWalletsByUserId = async (userId: string): Promise<PublicSavedWallet[]> => {
  try {
    const savedWallets = await prisma.savedWallet.findMany({
      where: { userId },
      select:{id:true, alias:true, wallet:{select:{address:true}}},
    });

    return savedWallets;
  } catch (error) {
    throw handleDBError(error);
  }
};

export const getSavedWallet = async (userId: string, walletId: string): Promise<PublicSavedWalletWithBalance> => {
  try {
    const savedWallet = await prisma.savedWallet.findFirst({
      where: { userId, walletId },
      select:{id:true, alias:true, wallet:{select:{address:true}}},
    });

    if(!savedWallet){
      throw ServiceError.notFound("Wallet is not saved.");
    }

    const balance = await calculateBalance(savedWallet.wallet.address);

    return {
      id: savedWallet.id,
      alias: savedWallet.alias,
      wallet: {
        address: savedWallet.wallet.address,
        balance,
      },
    };
  } catch (error) {
    throw handleDBError(error);
  }
};
export const updateSavedWalletAlias = async (
  userId: string, walletId: string, newAlias: string,
): Promise<PublicSavedWallet> => {
  try {
    const updatedSavedWallet = await prisma.savedWallet.update({
      where: {idx_unique_saved_wallet: {userId, walletId}},
      data: { alias: newAlias },
      select:{id:true, alias:true, wallet:{select:{address:true}}},
    });
    return updatedSavedWallet;
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteSavedWallet = async (userId: string, walletId: string): Promise<void> => {
  try {
    await prisma.savedWallet.delete({ where: {idx_unique_saved_wallet: {userId, walletId}}});
  } catch (error) {
    throw handleDBError(error);
  }
};
