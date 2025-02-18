import { error } from "common/lib/panic";
import type { GUID, IDToken, UserID } from "common/types";
import type { Request } from "express";
import { LRUCache } from "lru-cache";
import { prisma } from "../../database/client";
import { getGUID, getGUIDFromToken } from "./lib";
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

const guid_userid_cache = new LRUCache<GUID, UserID>({
  max: 100,
});

export async function getUserId(req: Request): Promise<UserID> {
  const guid = await getGUID(req);

  const cache = guid_userid_cache.get(guid);
  if (cache) {
    console.log(`[CACHE HIT] ${guid} -> ${cache}`);
    return cache;
  }

  const user = await prisma.user.findUnique({
    where: {
      guid: guid,
    },
    select: {
      id: true,
    },
  });
  if (!user) error("auth error: unauthorized", 401);

  guid_userid_cache.set(guid, user.id);
  return user.id;
}

export async function getUserIdFromToken(token: IDToken): Promise<UserID> {
  const guid = await getGUIDFromToken(token);

  const cache = guid_userid_cache.get(guid);
  if (cache) {
    return cache;
  }

  const user = await prisma.user.findUnique({
    where: {
      guid: guid,
    },
    select: {
      id: true,
    },
  });
  if (!user) throw new Error("User not found!");

  guid_userid_cache.set(guid, user.id);
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
  req: Request,
  userid: UserID,
): Promise<boolean> {
  try {
    return (await getUserId(req)) === userid;
  } catch (_) {
    return false;
  }
}
