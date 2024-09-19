import type { Request } from "express";
import * as admin from "firebase-admin/auth";
import { Err, Ok, type Result } from "../../common/lib/result";
import type { GUID, IDToken } from "../../common/types";
import { app } from "../init";

const auth = admin.getAuth(app);
type DecodedIdToken = admin.DecodedIdToken;

// REQUIRE: cookieParser middleware before this
// THROWS: if idToken is not present in request cookie, or when the token is not valid.
export async function getGUID(req: Request): Promise<GUID> {
  const idToken = req.query.token;
  if (typeof idToken !== "string") throw new Error();
  return (await verifyIDToken(idToken)).uid as GUID;
}

export async function getGUIDFromToken(token: IDToken): Promise<GUID> {
  const idToken = token;
  if (typeof idToken !== "string") throw new Error();
  return (await verifyIDToken(idToken)).uid as GUID;
}

export async function safeGetGUID(req: Request): Promise<Result<GUID>> {
  try {
    return Ok(await getGUID(req));
  } catch (e) {
    return Err(e);
  }
}

export async function verifyIDToken(idToken: IDToken): Promise<DecodedIdToken> {
  if (!idToken)
    throw new Error(
      "idToken not found on request.cookies. you must set it to the cookies before sending the request.",
    );
  return await auth.verifyIdToken(idToken);
}
