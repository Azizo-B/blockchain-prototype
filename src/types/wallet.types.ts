import type { Wallet } from "@prisma/client";
import type { ListResponse } from "./common.types";

export interface PrivateWallet extends Pick<Wallet, "id"|"address"|"privateKey">{};

export interface PublicWallet extends Pick<Wallet, "id"|"address">{};
export interface WalletWithBalance extends Wallet{
  balance: number 
};
export interface PublicWalletWithBalance extends PublicWallet{
  balance: number 
};
export interface GetAllWalletsResponse extends ListResponse<PublicWallet>{}
export interface GetWalletByIdResponse extends PublicWallet{}
export interface CreateWalletResponse extends GetWalletByIdResponse{}
export interface DeleteWalletByIdRequest {
  privateKey: string
} 