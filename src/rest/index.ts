import Router from "@koa/router";
import type { ApiContext, ApiState, KoaApplication } from "../types/koa.types";
import installBlockRoutes from "./block.rest";
import installTransactionRoutes from "./transaction.rest";
import installWalletRoutes from "./wallet.rest";
import installSessionRoutes from "./sessions.rest";
import installUserRoutes from "./user.rest";
import installNFTRoutes from "./nft.rest";

export default function installRest(app: KoaApplication){
  const router = new Router<ApiState, ApiContext>({ prefix: "/api" });

  installUserRoutes(router);
  installSessionRoutes(router);
  installWalletRoutes(router);
  installTransactionRoutes(router);
  installBlockRoutes(router);
  installNFTRoutes(router);

  app.use(router.routes()).use(router.allowedMethods());
};
