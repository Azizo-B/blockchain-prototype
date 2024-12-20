import type { NFT } from "@prisma/client";
import type { ListResponse } from "./common.types";

export interface CreateNFT extends Pick<NFT, "metadata">{
  privateKey: string
};
export interface CreateNFTRequest extends CreateNFT{};
export interface CreateNFTResponse extends NFT{};
export interface GetNFTByIdResponse extends NFT{};
export interface GetAllNFTsResponse extends ListResponse<NFT>{};
