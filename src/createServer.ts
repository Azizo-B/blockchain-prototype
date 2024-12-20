import Koa from "koa";
import config from "config";

import { getLogger } from "./core/logging";
import { initializeData, shutdownData } from "./data";
import installMiddlewares from "./core/installMiddlewares";
import installRest from "./rest";
import type {
  KoaApplication,
  ApiContext,
  ApiState,
} from "./types/koa.types";

const PORT = config.get<number>("port");

export interface Server {
  getApp(): KoaApplication;
  start(): Promise<void>;
  stop(): Promise<void>;
}

export default async function createServer(): Promise<Server> {
  const app = new Koa<ApiState, ApiContext>();

  installMiddlewares(app);
  await initializeData();
  installRest(app);

  return {
    getApp() {
      return app;
    },

    start() {
      return new Promise<void>((resolve) => {
        app.listen(PORT, () => {
          getLogger().info(`Koa listening on http://localhost:${PORT}`);
          resolve();
        });
      });
    },

    async stop() {
      app.removeAllListeners();
      await shutdownData();
      getLogger().info("Goodbye! 👋");
    },
  };
}