import { app } from "../init"
import * as admin from "firebase-admin/auth"
import type { Request } from "express";
import { GUID, IDToken } from "../../../../common/types";

const auth = admin.getAuth(app);
type DecodedIdToken = admin.DecodedIdToken;

// REQUIRE: cookieParser middleware before this
// THROWS: if idToken is not present in request cookie, or when the token is not valid.
export async function getGUID(req: Request): Promise<GUID> {
  const idToken = req.cookies["id-token"];
  return (await verifyIDToken(idToken)).uid;
}

export async function verifyIDToken(idToken: IDToken): Promise<DecodedIdToken> {
  if (!idToken)
    throw new Error(
      "idToken not found on request.cookies. you must set it to the cookies before sending the request.",
    );
  return await auth.verifyIdToken(idToken);
}
