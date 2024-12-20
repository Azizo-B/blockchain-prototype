import type { SavedWallet } from "@prisma/client";
import type { ListResponse } from "./common.types";

export interface PublicSavedWallet extends Pick<SavedWallet, "id"|"alias">{
  wallet:{
    address: string
  }
};
export interface PublicSavedWalletWithBalance extends PublicSavedWallet{
  wallet:{
    address: string
    balance: number
  }
};
export interface GetSavedWalletByIdResponse extends PublicSavedWalletWithBalance{};
export interface GetSavedWalletsResponse extends ListResponse<PublicSavedWallet>{};
export interface SavedWalletCreateInput extends Pick<SavedWallet, "alias"|"walletId">{};
export interface CreateSavedWalletRequest extends SavedWalletCreateInput{};
export interface UpdateAliasRequest extends Pick<SavedWallet, "alias">{};
export interface BaseSavedWalletRequest{
  userId:string
}
export interface UserAndWalletIdParams extends BaseSavedWalletRequest{
  walletId: string,
};
