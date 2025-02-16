import type { IDToken, UserID } from "common/types";
import { getGUID, getGUIDFromToken } from "./lib";

import { error } from "common/lib/panic";
import type { Context } from "hono";
import { prisma } from "../../database/client";
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
export async function getUserId(c: Context): Promise<UserID> {
  const guid = await getGUID(c);
  const user = await prisma.user.findUnique({
    where: {
      guid: guid,
    },
    select: {
      id: true,
    },
  });
  if (!user) error("auth error: unauthorized", 401);
  return user.id;
}

export async function getUserIdFromToken(token: IDToken): Promise<UserID> {
  const guid = await getGUIDFromToken(token);
  const user = await prisma.user.findUnique({
    where: {
      guid: guid,
    },
  });
  if (!user) error("User not found!", 401);
  return user.id;
}

/** returns true if userid is requester's id.
 * otherwise returns false.
 * never throws.
 Expected use case:
 ```js
 const param_id = req.params.userid;
 if (!isRequester(req, param_id))
   return res.status(401).send("auth error");
 ```
 **/
export async function isRequester(
  c: Context,
  userid: UserID,
): Promise<boolean> {
  try {
    return (await getUserId(c)) === userid;
  } catch (_) {
    return false;
  }
}
