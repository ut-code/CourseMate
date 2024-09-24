import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

if (!process.env.DATABASE_URL) {
  dotenv.config({ path: "./env.dev" });
}

export let prisma = new PrismaClient();

// not sure if this is necessary
export function reload() {
  prisma = new PrismaClient();
}
