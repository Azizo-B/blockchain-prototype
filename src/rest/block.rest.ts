import Router from "@koa/router";
import * as blockService from "../service/block.service";
import type {
  CreateBlockRequest,
  CreateBlockResponse,
  GetAllBlocksResponse,
  GetBlockByIdResponse,
} from "../types/block.types";
import type { IdParams } from "../types/common.types";
import type { ApiContext, ApiState, KoaContext } from "../types/koa.types";
import Joi from "joi";
import validate from "../core/validation";

const createBlock = async (ctx: KoaContext<CreateBlockResponse, void, CreateBlockRequest>): Promise<void> => {
  const { walletAddress } = ctx.request.body;
  ctx.body = await blockService.createBlock(walletAddress);
};

createBlock.validationScheme = {body:{walletAddress:Joi.string().required()}};

const getAllBlocks = async (ctx: KoaContext<GetAllBlocksResponse>): Promise<void> => {
  ctx.body = {
    items: await blockService.getAll(),
  };
};

const getBlockById = async (ctx: KoaContext<GetBlockByIdResponse, IdParams>): Promise<void> => {
  ctx.body = await blockService.getById(ctx.params.id);
};

getBlockById.validationScheme = {params:{id:Joi.string().hex().length(24).required()}};

export default function installBlockRoutes(parentRouter: Router<ApiState, ApiContext>) {
  const blockRouter = new Router<ApiState, ApiContext>({prefix: "/blocks"});

  blockRouter.post("/", validate(createBlock.validationScheme), createBlock);
  blockRouter.get("/", getAllBlocks);
  blockRouter.get("/:id", validate(getBlockById.validationScheme), getBlockById);

  parentRouter.use(blockRouter.routes(), blockRouter.allowedMethods());
};
