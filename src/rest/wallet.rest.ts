import Router from "@koa/router";
import * as walletService from "../service/wallet.service";
import type { IdParams } from "../types/common.types";
import type { ApiContext, ApiState, KoaContext } from "../types/koa.types";
import type { 
  CreateWalletResponse, 
  DeleteWalletByIdRequest, 
  GetAllWalletsResponse, 
  GetWalletByIdResponse, 
} from "../types/wallet.types";
import { requireAuthentication } from "../core/auth";
import Joi from "joi";
import validate from "../core/validation";

const createWallet = async (ctx: KoaContext<CreateWalletResponse>): Promise<void> => {
  ctx.body = await walletService.createWallet(ctx.state.session.userId);
};

const getAllWallets = async (ctx: KoaContext<GetAllWalletsResponse>): Promise<void> => {
  ctx.body = {
    items: await walletService.getAll(),
  };
};

const getWalletById = async (ctx: KoaContext<GetWalletByIdResponse, IdParams>): Promise<void> => {
  ctx.body = await walletService.getById(ctx.params.id);
};

getWalletById.validationScheme = {
  params: {
    id: Joi.string().hex().length(24).required(),
  },
};

const deleteWalletById = async (ctx: KoaContext<void, IdParams, DeleteWalletByIdRequest>): Promise<void> => {
  ctx.body = await walletService.deleteById(ctx.params.id, ctx.request.body.privateKey);
};

deleteWalletById.validationScheme = {
  params: {
    id: Joi.string().hex().length(24).required(),
  },
  body:{
    privateKey: Joi.string().required(),
  },
};

export default function installWalletRoutes(parentRouter: Router<ApiState, ApiContext>) {
  const walletRouter = new Router<ApiState, ApiContext>({prefix: "/wallets"});

  walletRouter.post("/", requireAuthentication, validate(null), createWallet);
  walletRouter.get("/", validate(null), getAllWallets);
  walletRouter.get("/:id", validate(getWalletById.validationScheme), getWalletById);
  walletRouter.delete("/:id", validate(deleteWalletById.validationScheme), deleteWalletById);

  parentRouter.use(walletRouter.routes(), walletRouter.allowedMethods());
};
