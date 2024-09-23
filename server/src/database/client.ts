import { PrismaClient } from "@prisma/client";

export let prisma = new PrismaClient();

export function reload() {
  prisma = new PrismaClient();
}
