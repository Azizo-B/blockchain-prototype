import Router from "@koa/router";
import Joi from "joi";
import * as nftService from "../service/nft.service";
import type { KoaContext, ApiContext, ApiState } from "../types/koa.types";
import type { IdParams } from "../types/common.types";
import validate from "../core/validation";
import type { CreateNFTRequest, GetNFTByIdResponse, GetAllNFTsResponse, CreateNFTResponse } from "../types/nft.types";

const getAllNFTs = async (ctx: KoaContext<GetAllNFTsResponse>) => {
  const nfts = await nftService.getAll();
  ctx.body = { items: nfts };
};

const getNFTById = async (ctx: KoaContext<GetNFTByIdResponse, IdParams>) => {
  const nft = await nftService.getById(ctx.params.id);
  ctx.body = nft;
};

getNFTById.validationScheme = { params: { id: Joi.string().required() } };

const createNFT = async (ctx: KoaContext<CreateNFTResponse, void, CreateNFTRequest>) => {
  const nft = await nftService.createNft(ctx.request.body);
  ctx.status = 201;
  ctx.body = nft;
};

createNFT.validationScheme = {
  body: {
    metadata: Joi.object().required(),
    privateKey: Joi.string().required(),
  },
};

const deleteNFT = async (ctx: KoaContext<void, IdParams, { privateKey: string }>) => {
  const { id } = ctx.params;
  const { privateKey } = ctx.request.body;
  await nftService.burnNFT(id, privateKey);
  ctx.status = 204;
};

deleteNFT.validationScheme = {
  params: { id: Joi.string().hex().length(24).required() },
  body: {
    privateKey: Joi.string().required(),
  },
};

export default function installNFTRoutes(parent: Router<ApiState, ApiContext>) {
  const router = new Router<ApiState, ApiContext>({ prefix: "/nfts" });

  router.get(
    "/",
    getAllNFTs,
  );

  router.get(
    "/:id",
    validate(getNFTById.validationScheme),
    getNFTById,
  );

  router.post(
    "/",
    validate(createNFT.validationScheme),
    createNFT,
  );

  router.delete(
    "/:id",
    validate(deleteNFT.validationScheme),
    deleteNFT,
  );

  parent.use(router.routes()).use(router.allowedMethods());
};
