import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../core/password";
import roles from "../core/roles";
import { getElliptic } from "../core/keygenerator";
import config  from "config";

const BLOCK_REWARD = config.get<number>("blockchainMetadata.blockReward");
const prisma = new PrismaClient();

async function main() {
  try {
    // Clear existing data
    await prisma.block.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.nFT.deleteMany();
    await prisma.savedWallet.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.user.deleteMany();

    // Seed Users
    const userAlpha = await prisma.user.create({
      data: {
        name: "Alpha",
        email: "alpha@gmail.com",
        password_hash: await hashPassword("passwordAlpha123"),
        roles: JSON.stringify([roles.ADMIN]),
      },
    });

    const userBravo = await prisma.user.create({
      data: {
        name: "Bravo",
        email: "bravo@gmail.com",
        password_hash: await hashPassword("passwordBravo123"),
        roles: JSON.stringify([roles.USER]),
      },
    });

    const userCharlie = await prisma.user.create({
      data: {
        name: "Charlie",
        email: "charlie@gmail.com",
        password_hash: await hashPassword("passwordCharlie123"),
        roles: JSON.stringify([roles.USER]),
      },
    });

    // Seed Wallets
    const keyAlpha = getElliptic().genKeyPair();
    const walletAlpha = await prisma.wallet.create({
      data: {
        address: keyAlpha.getPublic("hex"), 
        privateKey: keyAlpha.getPrivate("hex"),
        userId: userAlpha.id,
      },
    });

    const keyBravo = getElliptic().genKeyPair();
    const walletBravo = await prisma.wallet.create({
      data: {
        address: keyBravo.getPublic("hex"), 
        privateKey: keyBravo.getPrivate("hex"),
        userId: userBravo.id,
      },
    });

    const keyCharlie = getElliptic().genKeyPair();
    const walletCharlie = await prisma.wallet.create({
      data: {
        address: keyCharlie.getPublic("hex"), 
        privateKey: keyCharlie.getPrivate("hex"),
        userId: userCharlie.id,
      },
    });

    // Seed Saved Wallets
    const savedWalletAlpha = await prisma.savedWallet.create({
      data: {
        alias: "Alpha's Special Ops Wallet",
        userId: userBravo.id,
        walletId: walletAlpha.id,
      },
    });

    const savedWalletBravo = await prisma.savedWallet.create({
      data: {
        alias: "Bravo's Covert Wallet",
        userId: userAlpha.id,
        walletId: walletBravo.id,
      },
    });

    const savedWalletCharlie = await prisma.savedWallet.create({
      data: {
        alias: "Charlie’s Tactical Wallet",
        userId: userCharlie.id,
        walletId: walletCharlie.id,
      },
    });

    // Seed NFTs
    const nftAlpha = await prisma.nFT.create({
      data: {
        metadata: { name: "COD Alpha Operator", description: "Alpha’s signature operator skin" },
        creatorId: walletAlpha.id,
        ownerId: walletAlpha.id,
      },
    });

    const nftBravo = await prisma.nFT.create({
      data: {
        metadata: { name: "COD Bravo Sniper", description: "Bravo’s custom sniper rifle skin" },
        creatorId: walletBravo.id,
        ownerId: walletBravo.id,
      },
    });

    const nftCharlie = await prisma.nFT.create({
      data: {
        metadata: { name: "COD Charlie Recon", description: "Charlie’s elite recon equipment" },
        creatorId: walletCharlie.id,
        ownerId: walletCharlie.id,
      },
    });

    // Seed Transactions (Minting NFTs)
    const mintingAlpha = await prisma.transaction.create({
      data: {
        type: "minting",
        status: "pending",
        amount: 0,
        fromAddress: walletAlpha.address,
        toAddress: walletAlpha.address,
        signature: "mint-signatureAlpha",
        nftId: nftAlpha.id,
      },
    });

    const mintingBravo = await prisma.transaction.create({
      data: {
        type: "minting",
        status:"pending",
        amount: 0,
        fromAddress: walletBravo.address,
        toAddress: walletBravo.address,
        signature: "mint-signatureBravo",
        nftId: nftBravo.id,
      },
    });

    const mintingCharlie = await prisma.transaction.create({
      data: {
        type: "minting",
        status: "pending",
        amount: 0,
        fromAddress: walletCharlie.address,
        toAddress: walletCharlie.address,
        signature: "mint-signatureCharlie",
        nftId: nftCharlie.id,
      },
    });

    // Seed Burned NFT
    const nftBurned = await prisma.nFT.create({
      data: {
        metadata: { name: "COD Burned Weapon", description: "A weapon skin burned in the fires of battle" },
        creatorId: walletAlpha.id,
        ownerId: null, // Burn address
      },
    });

    // Seed NFT Transfers
    const transferAlphaToBravo = await prisma.transaction.create({
      data: {
        type: "nft_transfer",
        status:"pending",
        amount: 0,
        fromAddress: walletAlpha.address,
        toAddress: walletBravo.address,
        signature: "transfer-signatureAlphaToBravo",
        nftId: nftAlpha.id,
      },
    });

    const transferBravoToCharlie = await prisma.transaction.create({
      data: {
        type: "nft_transfer",
        status:"pending",
        amount: 0,
        fromAddress: walletBravo.address,
        toAddress: walletCharlie.address,
        signature: "transfer-signatureBravoToCharlie",
        nftId: nftBravo.id,
      },
    });

    const transferCharlieToAlpha = await prisma.transaction.create({
      data: {
        type: "nft_transfer",
        status:"pending",
        amount: 0,
        fromAddress: walletCharlie.address,
        toAddress: walletAlpha.address,
        signature: "transfer-signatureCharlieToAlpha",
        nftId: nftCharlie.id,
      },
    });

    const genesisBlock = await prisma.block.create({
      data:{
        hash: "GenesisBlock",
        index: 0,
        nonce: 0,
        previousHash: "",  
        transactions:{
          create:{
            amount: BLOCK_REWARD,
            status:"completed",
            toAddress: walletAlpha.address,
            fromAddress: "block_reward",
            type: "transfer",
          },
        }, 
      },
    });

    console.log("Seed data created successfully!", {
      users: [userAlpha, userBravo, userCharlie],
      wallets: [walletAlpha, walletBravo, walletCharlie],
      savedWallets: [savedWalletAlpha, savedWalletBravo, savedWalletCharlie],
      nfts: [nftAlpha, nftBravo, nftCharlie, nftBurned],
      transactions: [
        mintingAlpha, mintingBravo, mintingCharlie, 
        transferAlphaToBravo, transferBravoToCharlie, transferCharlieToAlpha,
      ],
      blocks: [genesisBlock],
    });
  } catch (error) {
    console.error("Error during seed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
