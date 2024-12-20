import type { Next } from "koa";
import Router from "@koa/router";
import Joi from "joi";
import * as userService from "../service/user.service";
import type { KoaContext, ApiContext, ApiState } from "../types/koa.types";
import type {
  RegisterUserRequest,
  GetAllUsersResponse,
  GetUserByIdResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  LoginResponse,
  GetUserRequest,
} from "../types/user.types";
import type { IdParams } from "../types/common.types";
import validate from "../core/validation";
import { requireAuthentication, makeRequireRole, authDelay } from "../core/auth";
import Role from "../core/roles";
import type { 
  BaseSavedWalletRequest,
  CreateSavedWalletRequest, 
  GetSavedWalletByIdResponse, 
  GetSavedWalletsResponse, 
  PublicSavedWallet, 
  UpdateAliasRequest, 
  UserAndWalletIdParams,
} from "../types/savedWallet.types";

const checkUserId = (ctx: KoaContext<unknown, GetUserRequest>, next: Next) => {
  const { userId, roles } = ctx.state.session;
  const { id } = ctx.params;

  if (id !== "me" && id !== userId && !roles.includes(Role.ADMIN)) {
    return ctx.throw(403, "You are not allowed to view this user's information.", { code: "FORBIDDEN" });
  }
  return next();
};
const checkUserSavedWalletPermissions = (ctx: KoaContext<unknown, BaseSavedWalletRequest>, next: Next) => {
  const { userId, roles } = ctx.state.session;
  const requestUserId= ctx.params.userId;

  if (requestUserId !== "me" && requestUserId !== userId && !roles.includes(Role.ADMIN)) {
    return ctx.throw(403, "You are not allowed to view this user's saved wallet information", { code: "FORBIDDEN" });
  }
  return next();
};

const getAllUsers = async (ctx: KoaContext<GetAllUsersResponse>) => {
  const users = await userService.getAll();
  ctx.body = { items: users };
};

getAllUsers.validationScheme = null;

const registerUser = async (ctx: KoaContext<LoginResponse, void, RegisterUserRequest>) => {
  const token = await userService.register(ctx.request.body);
  ctx.status = 200;
  ctx.body = { token };
};

registerUser.validationScheme = {
  body: {
    name: Joi.string().max(255),
    email: Joi.string().email(),
    password: Joi.string().min(12).max(128),
  },
};

const getUserById = async (ctx: KoaContext<GetUserByIdResponse, GetUserRequest>) => {
  const user = await userService.getById(
    ctx.params.id === "me" ? ctx.state.session.userId : ctx.params.id,
  );
  ctx.status = 200;
  ctx.body = user;
};

getUserById.validationScheme = {
  params: {
    id: Joi.alternatives().try(
      Joi.string().hex().length(24).required(),
      Joi.string().valid("me"),
    ),
  },
};

const updateUserById = async (ctx: KoaContext<UpdateUserResponse, IdParams, UpdateUserRequest>) => {
  const user = await userService.updateById(ctx.params.id, ctx.request.body);
  ctx.status = 200;
  ctx.body = user;
};

updateUserById.validationScheme = {
  params: { id: Joi.alternatives().try(
    Joi.string().hex().length(24).required(),
    Joi.string().valid("me"),
  )},
  body: {
    name: Joi.string().max(255),
  },
};

const deleteUserById = async (ctx: KoaContext<void, IdParams>) => {
  await userService.deleteById(ctx.params.id);
  ctx.status = 204;
};

deleteUserById.validationScheme = {
  params: {
    id: Joi.alternatives().try(
      Joi.string().hex().length(24).required(),
      Joi.string().valid("me"),
    ),
  },
};

const createSavedWallet = async (
  ctx: KoaContext<GetSavedWalletByIdResponse, IdParams, CreateSavedWalletRequest>,
) => {
  const savedWallet = await userService.saveWallet(
    ctx.params.id === "me" ? ctx.state.session.userId : ctx.params.id, ctx.request.body,
  );
  ctx.status = 201;
  ctx.body = savedWallet;
};
createSavedWallet.validationScheme = {
  params: { 
    id: Joi.alternatives().try(
      Joi.string().hex().length(24).required(),
      Joi.string().valid("me"),
    )},
  body: {
    alias: Joi.string().max(255).required(),
    walletId: Joi.string().hex().length(24).required(),
  },
};

const getSavedWallets = async (
  ctx: KoaContext<GetSavedWalletsResponse, IdParams>,
) => {
  const savedWallet = await userService.getSavedWalletsByUserId(
    ctx.params.id === "me" ? ctx.state.session.userId : ctx.params.id,
  );
  ctx.status = 200;
  ctx.body = {items:savedWallet};
};
getSavedWallets.validationScheme = {
  params: { id: Joi.alternatives().try(
    Joi.string().hex().length(24).required(),
    Joi.string().valid("me"),
  )},
};

const getSavedWallet = async (
  ctx: KoaContext<GetSavedWalletByIdResponse, UserAndWalletIdParams>,
) => {
  const savedWallet = await userService.getSavedWallet(
    ctx.params.userId === "me" ? ctx.state.session.userId : ctx.params.userId, ctx.params.walletId,
  );
  ctx.status = 200;
  ctx.body = savedWallet;
};
getSavedWallet.validationScheme = {
  params: { 
    userId: Joi.alternatives().try(
      Joi.string().hex().length(24).required(),
      Joi.string().valid("me"),
    ),
    walletId: Joi.string().hex().length(24).required(),
  },
};

const updateSavedWalletAlias = async (
  ctx: KoaContext<PublicSavedWallet, UserAndWalletIdParams, UpdateAliasRequest>,
) => {
  const { alias } = ctx.request.body;
  const updatedSavedWallet = await userService.updateSavedWalletAlias(
    ctx.params.userId === "me" ? ctx.state.session.userId : ctx.params.userId, ctx.params.walletId, alias,
  );
  ctx.status = 200;
  ctx.body = updatedSavedWallet;
};
updateSavedWalletAlias.validationScheme = {
  params: { 
    userId: Joi.alternatives().try(
      Joi.string().hex().length(24).required(),
      Joi.string().valid("me"),
    ),
    walletId: Joi.string().hex().length(24).required(),
  },
  body: {
    alias: Joi.string().max(255).required(),
  },
};

const deleteSavedWallet = async (
  ctx: KoaContext<void, UserAndWalletIdParams>,
) => {
  await userService.deleteSavedWallet(
    ctx.params.userId === "me" ? ctx.state.session.userId : ctx.params.userId, ctx.params.walletId,
  );
  ctx.status = 204;
};
deleteSavedWallet.validationScheme = {
  params: { 
    userId: Joi.alternatives().try(
      Joi.string().hex().length(24).required(),
      Joi.string().valid("me"),
    ),
    walletId: Joi.string().hex().length(24).required(),
  },
};

export default function installUserRoutes(parent: Router<ApiState, ApiContext>) {
  const router = new Router<ApiState, ApiContext>({ prefix: "/users" });
  
  const requireAdmin = makeRequireRole(Role.ADMIN);
  
  router.get(
    "/",
    requireAuthentication,
    requireAdmin,
    validate(getAllUsers.validationScheme),
    getAllUsers,
  );
  router.get(
    "/:id",
    requireAuthentication,
    validate(getUserById.validationScheme),
    checkUserId,
    getUserById,
  );
  router.post(
    "/",
    authDelay,
    validate(registerUser.validationScheme),
    registerUser,
  );
  router.put(
    "/:id",
    requireAuthentication,
    validate(updateUserById.validationScheme),
    checkUserId,
    updateUserById,
  );
  router.delete(
    "/:id",
    requireAuthentication,
    validate(deleteUserById.validationScheme),
    checkUserId,
    deleteUserById,
  );

  // Saved Wallet Routes
  router.get(
    "/:id/saved-wallets",
    requireAuthentication,
    checkUserId,
    validate(getSavedWallets.validationScheme),
    getSavedWallets,
  );
  router.get(
    "/:userId/saved-wallets/:walletId",
    requireAuthentication,
    checkUserSavedWalletPermissions,
    validate(getSavedWallet.validationScheme),
    getSavedWallet,
  );
  router.post(
    "/:id/saved-wallets",
    requireAuthentication,
    checkUserId,
    validate(createSavedWallet.validationScheme),
    createSavedWallet,
  );
  router.put(
    "/:userId/saved-wallets/:walletId",
    requireAuthentication,
    checkUserSavedWalletPermissions,
    validate(updateSavedWalletAlias.validationScheme),
    updateSavedWalletAlias,
  );
  router.delete(
    "/:userId/saved-wallets/:walletId",
    requireAuthentication,
    checkUserSavedWalletPermissions,
    validate(deleteSavedWallet.validationScheme),
    deleteSavedWallet,
  );
  
  parent
    .use(router.routes())
    .use(router.allowedMethods());
};