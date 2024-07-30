import type { Request } from "express";
import { Result, Ok, Err } from "../../common/lib/result";
import { getGUID } from "./lib";
import { PrismaClient } from "@prisma/client";
import { UserID } from "../../common/types";

const prisma = new PrismaClient();
/**
 * REQUIRE: cookieParser middleware before this
 * THROWS: if idToken is not present in request cookie, or when the token is not valid.
 * Expected use case:
 * ```js
 * let userId: number;
 * try {
 *   userId = await getUserId(req);
 * } catch {
 *   return res.status(401).send("auth error");
 * }
 * ```
 **/
export async function getUserId(req: Request): Promise<UserID> {
  const guid = await getGUID(req);
  const user = await prisma.user.findUnique({
    where: {
      guid: guid,
    },
  });
  if (!user) throw new Error("User not found!");
  return user.id;
}

/**
 * never throws.
 * Expected use case:
 * ```js
 *  const result = await safeGetUserId(req);
 *  if (!result.ok)
 *    return res.status(401).send("auth error");
 *  const userId = result.value;
 * ```
 **/
export async function safeGetUserId(req: Request): Promise<Result<UserID>> {
  try {
    return Ok(await getUserId(req));
  } catch (e) {
    return Err(e);
  }
}

/** returns true if userid is requester's id.
 * otherwise returns false.
 * never throws.
 Expected use case:
 ```js
 const paramid = req.params.userid;
 if (!isRequester(req, paramid))
   return res.status(401).send("auth error");
 ```
 **/
export async function isRequester(
  req: Request,
  userid: UserID,
): Promise<boolean> {
  const result = await safeGetUserId(req);
  if (!result.ok) return false;
  if (result.value !== userid) return false;

  return true;
}
