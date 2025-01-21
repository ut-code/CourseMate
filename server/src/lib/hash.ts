import crypto from "node:crypto";

export function sha256(src: string): string {
  const hasher = crypto.createHash("sha256");
  hasher.update(src);
  return hasher.digest("hex");
}
