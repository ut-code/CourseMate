import { getAuth } from "firebase-admin/auth";
import type { Request } from "express";
import { getGUID } from "./lib";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// REQUIRE: cookieParser middleware before this
// THROWS: if idToken is not present in request cookie, or when the token is not valid.
export async function getUserId(req: Request) {
  const guid = await getGUID(req);
  const userid = await prisma.user.findUnique({
    where:{
      guid: guid,
    },
  });
}
