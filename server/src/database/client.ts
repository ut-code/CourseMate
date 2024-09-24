import { PrismaClient } from "@prisma/client";
import "../load-env";

export let prisma = new PrismaClient();

// not sure if this is necessary
export function reload() {
  prisma = new PrismaClient();
}
