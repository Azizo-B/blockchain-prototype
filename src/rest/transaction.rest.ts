import Router from "@koa/router";
import * as transactionService from "../service/transaction.service";
import type { IdParams } from "../types/common.types";
import type { ApiContext, ApiState, KoaContext } from "../types/koa.types";
import type {
  CreateTransactionRequest,
  CreateTransactionResponse,
  DeleteTransactionByIdRequest,
  GetAllTransactionsResponse,
  GetTransactionByIdResponse,
} from "../types/transaction.types";
import Joi from "joi";
import validate from "../core/validation";

const createTransaction = async (
  ctx: KoaContext<CreateTransactionResponse, void, CreateTransactionRequest>,
): Promise<void> => {
  const { tx, privateKey } = ctx.request.body;
  ctx.body = await transactionService.createTransaction(tx, privateKey);
};

createTransaction.validationScheme = {
  body: {
    tx:{
      amount: Joi.number().positive().required(),
      toAddress: Joi.string().required(),
      fromAddress: Joi.string().required(),
    },
    privateKey: Joi.string().required(),
  },
};

const getAllTransactions = async (ctx: KoaContext<GetAllTransactionsResponse>): Promise<void> => {
  ctx.body = {
    items: await transactionService.getAll(),
  };
};

const getTransactionById = async (ctx: KoaContext<GetTransactionByIdResponse, IdParams>): Promise<void> => {
  ctx.body = await transactionService.getById(ctx.params.id);
};

const deleteTransactionById = async (ctx: KoaContext<void, IdParams, DeleteTransactionByIdRequest>): Promise<void> => {
  await transactionService.deleteById(ctx.params.id, ctx.request.body.privateKey);
  ctx.status = 204;
};
deleteTransactionById.validationScheme = {
  params: {
    id: Joi.string().hex().length(24).required(),
  },
  body:{
    privateKey: Joi.string().required(),
  },
};

export default function installTransactionRoutes(parentRouter: Router<ApiState, ApiContext>) {
  const transactionRouter = new Router<ApiState, ApiContext>({prefix:"/transactions"});

  transactionRouter.post("/", validate(createTransaction.validationScheme), createTransaction);

  transactionRouter.get("/", getAllTransactions);
  
  transactionRouter.get("/:id", getTransactionById);

  transactionRouter.delete("/:id", validate(deleteTransactionById.validationScheme), deleteTransactionById);

  parentRouter.use(transactionRouter.routes(), transactionRouter.allowedMethods());
};
