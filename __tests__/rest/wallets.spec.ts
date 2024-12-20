/* eslint-disable @stylistic/max-len */
import type supertest from "supertest";
// import { login, loginAdmin } from "../helpers/login";
import withServer from "../helpers/withServer";

describe("Transactions", () => {
  
  let request: supertest.Agent;

  withServer((r) => (request = r));

  const url = "/api/wallets";

  describe(`GET ${url}`, () => {
    it("should 200 and return wallets", async () => {
      const response = await request.get(url);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(3);
       
      expect(response.body.items).toEqual(expect.arrayContaining([{"address": "04690fc77ee2cf468b51fa8c2097a755eeda2ab21a8898944e94a2a3015b4432067ef934c943d7e819ac5e43b58d79b5427f47ae2cc7c3fb0d383076e010596b1b", "id": "6764270e42d7ce220802322a"}, {"address": "0492859fa23125c2d67f703454f655aa3fc8256aad9d7f4506208d5e39e77b593b871aeaccdeca4c54b12b4ca8d31a96a6450d56ad8b2033a074979c6be533d954", "id": "67642506732dba702e0ab7ac"}, {"address": "043b7e771b50a5869dd135bc3db16889a8010eb5d90da3c0a26f57f69ec356c5e705c2b73e6d1061419bbe8f99b598fad7745ec214971e4ef3bd074d9bdeb03e57", "id": "67642506732dba702e0ab7ad"}]));
    });
    
    it("should 400 when given an argument", async () => {
      const response = await request.get(`${url}?invalid=true`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.query).toHaveProperty("invalid");
    });
    
    it("should 200  and return wallet", async () => {
      const response = await request.get(url + "/6764270e42d7ce220802322a");

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({"address": "04690fc77ee2cf468b51fa8c2097a755eeda2ab21a8898944e94a2a3015b4432067ef934c943d7e819ac5e43b58d79b5427f47ae2cc7c3fb0d383076e010596b1b", "id": "6764270e42d7ce220802322a"});
    });

    it("should 404 when wallet does not exist", async () => {
      const response = await request.get(url + "/6764270e42d7ce2208023000");

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        "code": "NOT_FOUND",
        "message": "Wallet not found",
      });
    });
    
    it("should 401 when wallet private key is incorrect", async () => {
      const response = await request.delete(url + "/67642506732dba702e0ab7ad").send({privateKey:"wrong private key"});

      expect(response.statusCode).toBe(401);
      expect(response.body).toMatchObject({
        "code": "UNAUTHORIZED",
        "message": "Incorrect private key, you are not allowed to delete this wallet.",
      });
    });
    
    it("should 204 when wallet private key is correct", async () => {
      const response = await request.delete(url + "/67642506732dba702e0ab7ad").send({privateKey:"42c9ce76d505d0830512117996a002a05b29edf752eec42a8582f0e3f799735d"});

      expect(response.statusCode).toBe(204);
      expect(response.body).toMatchObject({});
    });
  });
});
