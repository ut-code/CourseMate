import { getAuth } from "firebase-admin/auth";
import type { Request } from "express";
import type { User } from "../../../common/types";

type UID = string

const app = getAuth();

// REQUIRE: bodyParser middleware before this
// THROWS: if idToken is not present in request cookie, or when the token is not valid.
export async function verify(req: Request): Promise<UID> {
  const idToken = req.body.idToken;
  if (!idToken) throw new Error("idToken not found on request.cookies. you must set it to the cookies before sending the request.");
  const token = await app.verifyIdToken(idToken)
  return token.uid;
}
