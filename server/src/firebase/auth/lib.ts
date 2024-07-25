import { getAuth } from "firebase-admin/auth";
import type { Request } from "express";

type UID = string;

const app = getAuth();

// REQUIRE: cookieParser middleware before this
// THROWS: if idToken is not present in request cookie, or when the token is not valid.
export async function verify(req: Request): Promise<UID> {
  const idToken = req.cookies.idToken;
  if (!idToken)
    throw new Error(
      "idToken not found on request.cookies. you must set it to the cookies before sending the request.",
    );
  const token = await app.verifyIdToken(idToken);
  return token.uid;
}

export async function isLoggedIn(req: Request): Promise<boolean> {
  try {
    const guid = await verify(req);
    if (guid === "") return false;
    return true;
  } catch {
    return false;
  }
}
