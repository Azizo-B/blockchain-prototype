import crypto from "crypto";

export async function calculateHash(message: string): Promise<string> {
  return crypto
    .createHash("SHA256")
    .update(message)
    .digest("hex");
}