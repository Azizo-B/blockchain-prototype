import { prisma } from "../data";
import type { NFT } from "@prisma/client";
import ServiceError from "../core/serviceError";
import handleDBError from "./_handleDBError";
import type { CreateNFT } from "../types/nft.types";
import type { InputJsonValue } from "@prisma/client/runtime/library";

export async function getAll(): Promise<NFT[]>{
  return prisma.nFT.findMany({});
}

export async function getById(id: string): Promise<NFT> {
  const nft = await prisma.nFT.findUnique({where: { id }, include: {transactions:true, owner:true, creator:true}});

  if (!nft) {
    throw ServiceError.notFound("NFT not found.");
  }

  return nft;
}

export async function burnNFT(id: string, privateKey: string): Promise<void> {
  try{
    const nft = await prisma.nFT.findUnique({
      where: { id, burned: false },
    });

    if (!nft) {
      throw ServiceError.notFound("NFT not found.");
    }

    if (!nft.ownerId) {
      throw ServiceError.notFound("NFT owner not found.");
    }

    const wallet = await prisma.wallet.findUnique({
      where:{
        id: nft.ownerId,
        privateKey:privateKey,
      },
    });

    if (!wallet){
      throw ServiceError.unauthorized("You cannot burn this NFT.");
    }

    await prisma.nFT.update({
      where:{id},
      data:{burned:true},
    });
  } catch(error){
    handleDBError(error);
  }
}

export const createNft = async (nft: CreateNFT) => {
  try{
    const wallet = await prisma.wallet.findFirst({
      where:{privateKey:nft.privateKey},
    });
    if (!wallet){
      throw ServiceError.unauthorized("Invalid private key.");
    }
    const metadata = nft.metadata as InputJsonValue;
    return prisma.nFT.create({
      data: {metadata, ownerId:wallet.id, creatorId:wallet.id},
    });

  }catch(error){
    handleDBError(error);
  }
};
