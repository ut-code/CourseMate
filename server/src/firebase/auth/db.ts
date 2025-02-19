import type { GUID, IDToken, UserID } from "common/types";
import type { Context } from "hono";
import { LRUCache } from "lru-cache";
import { prisma } from "../../database/client";
import { error } from "../../lib/error";
import { getGUID, getGUIDFromToken } from "./lib";

const guid_userid_cache = new LRUCache<GUID, UserID>({
  max: 100,
});

export async function getUserId(c: Context): Promise<UserID> {
  const guid = await getGUID(c);

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
  if (!user) error("User not found!", 401);
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
  c: Context,
  userid: UserID,
): Promise<boolean> {
  try {
    return (await getUserId(c)) === userid;
  } catch (_) {
    return false;
  }
}
