import Router from "@koa/router";
import Joi from "joi";
import validate from "../core/validation";
import * as userService from "../service/user.service";
import { authDelay } from "../core/auth";
import type {
  KoaContext,
  ApiState,
  ApiContext,
} from "../types/koa.types";
import type {
  LoginResponse,
  LoginRequest,
} from "../types/user.types";

const login = async (ctx: KoaContext<LoginResponse, void, LoginRequest>) => {
  const { email, password } = ctx.request.body;
  const token = await userService.login(email, password);

  ctx.status = 200;
  ctx.body = { token };
};
login.validationScheme = {
  body: {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};

export default function installSessionRoutes(parent: Router<ApiState, ApiContext>) {
  const router = new Router<ApiState, ApiContext>({
    prefix: "/sessions",
  });

  router.post(
    "/",
    authDelay,
    validate(login.validationScheme),
    login,
  );

  parent.use(router.routes()).use(router.allowedMethods());
}