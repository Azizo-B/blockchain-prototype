import { getElliptic } from "../core/keygenerator";
import { prisma } from "../data";
import { calculateBalance } from "../utils/calculateBalance";
import type { CreateTransaction, PublicTransaction } from "../types/transaction.types";
import { calculateHash } from "../utils/calculateHash";
import type { Transaction } from "@prisma/client";
import ServiceError from "../core/serviceError";
import handleDBError from "./_handleDBError";

export async function getAll(): Promise<PublicTransaction[]>{
  return prisma.transaction.findMany({
    select:{
      id:true, 
      amount:true, 
      fromAddress:true, 
      signature:true, 
      timestamp:true, 
      toAddress:true, 
      type:true, 
      status:true,
      blockId:false, 
      nftId:false,
    },
  });
}

export async function getById(id: string): Promise<Transaction> {
  const tx = await prisma.transaction.findUnique({
    where: { id },
    include: { block:true, nft:true },
  });

  if (!tx) {
    throw ServiceError.notFound("Transaction not found.");
  }

  return tx;
}

export async function deleteById(id: string, privateKey: string): Promise<void> {
  try{
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw ServiceError.notFound("Transaction not found.");
    }

    if (transaction.status === "completed") {
      throw ServiceError.conflict("Transaction is linked to a block and cannot be deleted.");
    }

    const key = getElliptic().keyFromPrivate(privateKey);
    const publicKey = key.getPublic("hex");

    if (publicKey !== transaction.fromAddress) {
      throw ServiceError.unauthorized("Invalid private key for the from address.");
    }

    await prisma.transaction.update({where: { id }, data:{status: "canceled"}});
  } catch(error){
    handleDBError(error);
  }
}

export async function createTransaction(tx: CreateTransaction, privateKey: string): Promise<PublicTransaction> {
  try{
    if (!tx.fromAddress || !tx.toAddress || tx.amount <= 0) {
      throw ServiceError.validationFailed("Invalid transaction data.");
    }

    const balance = await calculateBalance(tx.fromAddress);

    if (balance < tx.amount) {
      throw ServiceError.validationFailed("Insufficient balance.");
    }

    const key = getElliptic().keyFromPrivate(privateKey);
    const publicKey = key.getPublic("hex");

    if (publicKey !== tx.fromAddress) {
      throw ServiceError.unauthorized("Invalid private key for the from address.");
    }

    const timestamp = new Date();
    const signature = key.sign(
      JSON.stringify(
        calculateHash(tx.fromAddress + tx.toAddress + tx.amount + timestamp.toISOString()),
      ),
    ).toDER("hex");

    return prisma.transaction.create({
      data: {...tx,status:"pending", type:"transfer",signature,timestamp},
      select:{
        id:true, 
        amount:true, 
        fromAddress:true, 
        signature:true, 
        timestamp:true, 
        toAddress:true, 
        type:true,
        status:true, 
        blockId:false, 
        nftId:false,
      },
    });

  }catch(error){
    handleDBError(error);
  }
};
