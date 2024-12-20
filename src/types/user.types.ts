import type { Prisma } from "@prisma/client";
import type { Entity, ListResponse } from "./common.types";

export interface User extends Entity {
  name: string;
  email: string;
  password_hash: string;
  roles: Prisma.JsonValue;
}

export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
}

export interface PublicUser extends Pick<User, "id" | "name" | "email"> {}
export interface PublicUserWithWallets extends Pick<User, "id" | "name" | "email" > {
  wallets:{
    id: string,
    address: string,
    balance: number
  }[]
}

export interface UserUpdateInput extends Pick<UserCreateInput, "name"> {}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GetUserRequest {
  id: string;
}
export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}
export interface UpdateUserRequest extends Pick<RegisterUserRequest, "name" | "email"> {}

export interface GetAllUsersResponse extends ListResponse<PublicUser> {}
export interface GetUserByIdResponse extends PublicUser {}
export interface UpdateUserResponse extends GetUserByIdResponse {}

export interface LoginResponse {
  token: string;
}