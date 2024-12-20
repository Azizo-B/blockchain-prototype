import type { ParameterizedContext } from "koa";
import type Application from "koa";
import type Router from "@koa/router";
import type { SessionInfo } from "./auth.types";

export interface ApiState {
  session: SessionInfo
}

export interface ApiContext<
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> {
  request: {
    body: RequestBody;
    query: Query;
  };
  params: Params;
}

export type KoaContext<
  ResponseBody = unknown,
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> = ParameterizedContext<
  
  ApiState,
  ApiContext<Params, RequestBody, Query>,
  ResponseBody
>;

export interface KoaApplication
  extends Application<ApiState, ApiContext> {}

export interface KoaRouter extends Router<ApiState, ApiContext> {}
