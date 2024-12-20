import type { Transaction } from "@prisma/client";
import type { ListResponse } from "./common.types";

export interface CreateTransaction extends Pick<Transaction, "amount"|"fromAddress"|"toAddress">{};
export interface PublicTransaction extends Omit<Transaction, "blockId"|"nftId">{};

export interface CreateTransactionRequest {
  tx: CreateTransaction,
  privateKey: string
};
  
export interface GetAllTransactionsResponse extends ListResponse<PublicTransaction>{}
export interface GetTransactionByIdResponse extends PublicTransaction{}
export interface CreateTransactionResponse extends GetTransactionByIdResponse{}
export interface DeleteTransactionByIdRequest {
  privateKey:string
}