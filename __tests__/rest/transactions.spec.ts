/* eslint-disable @stylistic/max-len */
import type supertest from "supertest";
import withServer from "../helpers/withServer";

describe("Transactions", () => {
  let request: supertest.Agent;
  withServer((r) => (request = r));

  const url = "/api/transactions";

  describe(`GET ${url}`, () => {
    it("should 200 and return transactions", async () => {
      const response = await request.get(url);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBeGreaterThan(0);
    });
  });

  describe(`POST ${url}`, () => {
    it("should 400 when insufficient balance", async () => {
      const transactionData = {
        fromAddress: "04690fc77ee2cf468b51fa8c2097a755eeda2ab21a8898944e94a2a3015b4432067ef934c943d7e819ac5e43b58d79b5427f47ae2cc7c3fb0d383076e010596b1b",
        toAddress: "0492859fa23125c2d67f703454f655aa3fc8256aad9d7f4506208d5e39e77b593b871aeaccdeca4c54b12b4ca8d31a96a6450d56ad8b2033a074979c6be533d954",
        amount: 1000000, // Amount exceeding available balance
      };

      const response = await request.post(url)
        .send({tx: transactionData, privateKey:"wrong privatekey"});

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.message).toBe("Insufficient balance.");
    });
  });

  describe(`GET ${url}/:id`, () => {
    it("should 200 and return a specific transaction", async () => {
      const transactionId = "6763d453cc1777635211f900";

      const response = await request.get(`${url}/${transactionId}`);

      expect(response.statusCode).toBe(200);
    });

    it("should 404 when transaction does not exist", async () => {
      const response = await request.get(`${url}/6763d453cc1777635211f696`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Transaction not found.",
      });
    });
  });

  describe(`DELETE ${url}/:id`, () => {
    it("should 401 when invalid private key", async () => {
      const transactionId = "6763d453cc1777635211f901";

      const response = await request.delete(`${url}/${transactionId}`)
        .send({ privateKey: "wrong_private_key" });

      expect(response.statusCode).toBe(401);
      expect(response.body).toMatchObject({
        code: "UNAUTHORIZED",
        message: "Invalid private key for the from address.",
      });
    });

    it("should 204 when transaction is deleted successfully", async () => {
      const transactionId = "6763d453cc1777635211f901";

      const response = await request.delete(`${url}/${transactionId}`)
        .send({ privateKey: "9b6034a6a9c318a300b0898405f776fa025911da025aa494b60dd3609cd40b79" });

      expect(response.statusCode).toBe(204);
    });
  });
});
