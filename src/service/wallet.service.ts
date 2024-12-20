import type { Wallet } from "@prisma/client";
import { prisma } from "../data";
import type { PrivateWallet, PublicWallet, PublicWalletWithBalance } from "../types/wallet.types";
import { getElliptic } from "../core/keygenerator";
import { calculateBalance } from "../utils/calculateBalance";
import ServiceError from "../core/serviceError";
import handleDBError from "./_handleDBError";

const makeExposedWallet = ({ id, address }: Wallet): PublicWallet => ({id,address});

export async function createWallet(userId: string): Promise<PrivateWallet> {
  try{
    const key = getElliptic().genKeyPair();
    const wallet = await prisma.wallet.create({
      data: {
        address: key.getPublic("hex"), 
        privateKey: key.getPrivate("hex"),
        userId:userId,
      },
      select:{userId:false, address:true, privateKey:true, id:true},
    });
    return wallet;
  }catch(error){
    handleDBError(error);
  }
};

export async function getAll(): Promise<PublicWallet[]>{
  const wallets = await prisma.wallet.findMany({});
  return wallets.map(makeExposedWallet);
}

export async function getById(id: string): Promise<PublicWalletWithBalance> {
  const wallet = await prisma.wallet.findUnique({where: { id: id }});
  
  if(!wallet){
    throw ServiceError.notFound("Wallet not found");
  }
  const publicWallet = makeExposedWallet(wallet);
  const balance = await calculateBalance(publicWallet.address);
  
  return {...publicWallet, balance};
}

export async function deleteById(id: string, privateKey: string): Promise<void> {
  try{
    const wallet = await prisma.wallet.findFirst({where: { id, privateKey }});
    if(!wallet){
      throw ServiceError.unauthorized("Incorrect private key, you are not allowed to delete this wallet.");
    }
    await prisma.wallet.delete({where: { id, privateKey }});
  }catch(error){
    handleDBError(error);
  }
}