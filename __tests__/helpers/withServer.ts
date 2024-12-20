/* eslint-disable @stylistic/max-len */
import supertest from "supertest";
import type { Server } from "../../src/createServer";
import createServer from "../../src/createServer";
import { prisma } from "../../src/data";
import { hashPassword } from "../../src/core/password";
import Role from "../../src/core/roles";

export default function withServer(setter: (s: supertest.Agent) => void): void {
  let server: Server;

  beforeAll(async () => {
    server = await createServer();

    const passwordHash = await hashPassword("12345678");
    await prisma.user.createMany({
      data: [
        {
          id: "6763d453cc1777635211f899",
          name: "Test User",
          email: "test.user@hogent.be",
          password_hash: passwordHash,
          roles: JSON.stringify([Role.USER]),
        },
        {
          id: "6763d453cc1777635211f800",
          name: "Admin User",
          email: "admin.user@hogent.be",
          password_hash: passwordHash,
          roles: JSON.stringify([Role.ADMIN, Role.USER]),
        },
      ],
    });

    const userAlpha = await prisma.user.create({
      data: {
        name: "Alpha",
        email: "alpha@gmail.com",
        password_hash: await hashPassword("passwordAlpha123"),
        roles: JSON.stringify([Role.ADMIN]),
      },
    });

    const userBravo = await prisma.user.create({
      data: {
        name: "Bravo",
        email: "bravo@gmail.com",
        password_hash: await hashPassword("passwordBravo123"),
        roles: JSON.stringify([Role.USER]),
      },
    });

    const userCharlie = await prisma.user.create({
      data: {
        name: "Charlie",
        email: "charlie@gmail.com",
        password_hash: await hashPassword("passwordCharlie123"),
        roles: JSON.stringify([Role.USER]),
      },
    });

    // Seed Wallets
    await prisma.wallet.create({
      data: {
        id: "6764270e42d7ce220802322a",
        address: "04690fc77ee2cf468b51fa8c2097a755eeda2ab21a8898944e94a2a3015b4432067ef934c943d7e819ac5e43b58d79b5427f47ae2cc7c3fb0d383076e010596b1b", 
        privateKey: "85cdc881bf526da0d738d77f58570bc487ec817698865d7aecdf0cee67607a77",
        userId: userAlpha.id,
      },
    });

    await prisma.wallet.create({
      data: {
        address: "0492859fa23125c2d67f703454f655aa3fc8256aad9d7f4506208d5e39e77b593b871aeaccdeca4c54b12b4ca8d31a96a6450d56ad8b2033a074979c6be533d954", 
        id: "67642506732dba702e0ab7ac",
        privateKey: "9b6034a6a9c318a300b0898405f776fa025911da025aa494b60dd3609cd40b79",
        userId: userBravo.id,
      },
    });

    await prisma.wallet.create({
      data: {
        address: "043b7e771b50a5869dd135bc3db16889a8010eb5d90da3c0a26f57f69ec356c5e705c2b73e6d1061419bbe8f99b598fad7745ec214971e4ef3bd074d9bdeb03e57", 
        id: "67642506732dba702e0ab7ad",
        privateKey: "42c9ce76d505d0830512117996a002a05b29edf752eec42a8582f0e3f799735d",
        userId: userCharlie.id,
      },
    });
    
    // Seed Transactions
    await prisma.transaction.create({
      data: {
        id: "6763d453cc1777635211f900",
        amount: 100,
        toAddress: "04690fc77ee2cf468b51fa8c2097a755eeda2ab21a8898944e94a2a3015b4432067ef934c943d7e819ac5e43b58d79b5427f47ae2cc7c3fb0d383076e010596b1b", // sender's wallet address
        fromAddress: "0492859fa23125c2d67f703454f655aa3fc8256aad9d7f4506208d5e39e77b593b871aeaccdeca4c54b12b4ca8d31a96a6450d56ad8b2033a074979c6be533d954", // receiver's wallet address
        signature: "signature_string_example",
        type: "transfer", 
        status: "completed", 
      },
    });

    await prisma.transaction.create({
      data: {
        id:"6763d453cc1777635211f901",
        amount: 50,
        fromAddress: "0492859fa23125c2d67f703454f655aa3fc8256aad9d7f4506208d5e39e77b593b871aeaccdeca4c54b12b4ca8d31a96a6450d56ad8b2033a074979c6be533d954", // sender's wallet address
        toAddress: "043b7e771b50a5869dd135bc3db16889a8010eb5d90da3c0a26f57f69ec356c5e705c2b73e6d1061419bbe8f99b598fad7745ec214971e4ef3bd074d9bdeb03e57", // receiver's wallet address
        signature: "signature_string_example",
        type: "transfer", 
        status: "pending", 
      },
    });

    setter(supertest(server.getApp().callback()));
  });

  afterAll(async () => {
    await prisma.transaction.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.user.deleteMany();
    await server.stop();
  });
}