import { prisma } from "../data";
import type { Block } from "@prisma/client";
import type { BlockWithoutId, CreateBlockWithTransactions } from "../types/block.types";
import config from "config";
import { calculateHash } from "../utils/calculateHash";
import ServiceError from "../core/serviceError";
import handleDBError from "./_handleDBError";

const MAX_TRANSACTIONS_PER_BLOCK = config.get<number>("blockchainMetadata.maxTransactionsPerBlock");
const MINING_DIFFICULTY = config.get<number>("blockchainMetadata.miningDifficulty");
const BLOCK_REWARD = config.get<number>("blockchainMetadata.blockReward");

export async function getAll(): Promise<Block[]>{
  return prisma.block.findMany({});
}

export async function getById(id: string): Promise<Block> {
  const block = await prisma.block.findUnique({
    where: { id },
    include: { transactions: true },
  });
  
  if (!block) {
    throw ServiceError.notFound("Block not found.");
  }
  
  return block;
}

export async function createBlock(walletAddress: string): Promise<Block> {
  try{
    const wallet = await prisma.wallet.findUnique({
      where: {address: walletAddress},
    });

    if (!wallet) {
      throw ServiceError.validationFailed("Invalid miner address.");
    }

    const transactions = await prisma.transaction.findMany({
      where: {status:"pending"},
      take: MAX_TRANSACTIONS_PER_BLOCK,
    });

    if (transactions.length === 0) {
      throw ServiceError.notFound("Unable to create block: no transactions available to add to a block.");
    }

    const lastBlock = await prisma.block.findFirst({
      orderBy: {
        index: "desc",
      },
    });

    if (!lastBlock){
      throw ServiceError.notFound("Unable to create block: no previous block found.");
    }

    const blockWithoutId = await mineBlock(MINING_DIFFICULTY, {
      index: lastBlock.index + 1,
      timestamp: new Date(),
      previousHash: lastBlock.hash,
      nonce: 0,
      transactions,
    });

    const newBlock = await prisma.block.create({ 
      data: { 
        ...blockWithoutId, 
        transactions: {
          connect: transactions.map((tx) => ({ id: tx.id })),
        },
      }, 
      include:{
        transactions: true,
      },
    });

    await prisma.transaction.updateMany({
      where: {
        id: { in: transactions.map((tx) => tx.id) },
      },
      data: {
        status: "completed",
      },
    });

    await prisma.transaction.create({
      data: {
        type: "block_reward",
        status:"pending",
        amount: BLOCK_REWARD,
        toAddress: walletAddress,
      },
    });

    return newBlock;
  }catch(error){
    handleDBError(error);
  }
}

export async function mineBlock(difficulty: number, block: CreateBlockWithTransactions): Promise<BlockWithoutId> {
  let computedHash: string;
  do {
    block.nonce++;
    computedHash = await calculateHash(
      block.index +
      block.previousHash +
      block.timestamp.toISOString() +
      JSON.stringify(block.transactions) +
      block.nonce,
    );
  } while (
    computedHash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
  );

  return { ...block, hash: computedHash } as BlockWithoutId;
}
