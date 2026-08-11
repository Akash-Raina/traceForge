import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function generateApiKey(): string {
  return `tf_live_${randomBytes(32).toString("hex")}`;
}

export function hashApiKey(apiKey: string): string {
  return createHash("sha256").update(apiKey).digest("hex");
}

export function verifyApiKey(
  apiKey: string,
  storedHash: string,
): boolean {
  const incomingHash = Buffer.from(hashApiKey(apiKey), "hex");
  const storedHashBuffer = Buffer.from(storedHash, "hex");

  if (incomingHash.length !== storedHashBuffer.length) {
    return false;
  }

  return timingSafeEqual(incomingHash, storedHashBuffer);
}
