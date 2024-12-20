import type { Block, Prisma } from "@prisma/client";
import type { ListResponse } from "./common.types";

export interface BlockWithTransactions extends Prisma.BlockGetPayload<{ include: { transactions: true } }>{};
export interface CreateBlockWithTransactions extends Omit<BlockWithTransactions, "hash" | "id">{};
export interface BlockWithoutId extends Omit<Block, "id">{};

export interface CreateBlockRequest {
  walletAddress: string
};

export interface GetAllBlocksResponse extends ListResponse<Block>{}
export interface GetBlockByIdResponse extends Block{}
export interface CreateBlockResponse extends GetBlockByIdResponse{}