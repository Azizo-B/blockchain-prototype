export default {
  port: 9000,
  log: {
    level: "silly",
    disabled: false,
  },
  cors: {
    origins: ["https://localhost:9000", "https://localhost:10000"], // to be able to use swagger in prod
    maxAge: 3 * 60 * 60,
  },
  elliptic:{
    curve: "secp256k1",
  },
  blockchainMetadata: {
    maxTransactionsPerBlock: 100,
    miningDifficulty: 2,
    blockReward: 100,
  },
  auth: {
    maxDelay: 5000,
    argon: {
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },
    jwt: {
      audience: "prototype.blockchain",
      issuer: "prototype.blockchain",
    },
  },
};