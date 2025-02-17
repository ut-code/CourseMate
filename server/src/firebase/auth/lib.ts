import type { GUID, IDToken } from "common/types";
import * as admin from "firebase-admin/auth";
import type { Context } from "hono";
import { error } from "../../lib/error";
import { app } from "../init";

const auth = admin.getAuth(app);
type DecodedIdToken = admin.DecodedIdToken;

// REQUIRE: cookieParser middleware before this
// THROWS: if idToken is not present in request cookie, or when the token is not valid.
export async function getGUID(c: Context): Promise<GUID> {
  const idToken = c.req.query("token");
  if (typeof idToken !== "string") error("token not found in query", 401);
  return await getGUIDFromToken(idToken);
}

export let getGUIDFromToken = async (token: IDToken) => {
  return (await verifyIDToken(token)).uid as GUID;
};

// skip auth in test
if (process.env.UNSAFE_SKIP_AUTH) {
  getGUIDFromToken = async (token: IDToken) => {
    if (token === "I_AM_abc101") {
      return "abc101";
    }
    return (await verifyIDToken(token)).uid as GUID;
  };
}

export async function verifyIDToken(idToken: IDToken): Promise<DecodedIdToken> {
  if (!idToken)
    throw new Error(
      "idToken not found on request.cookies. you must set it to the cookies before sending the request.",
    );
  return await auth.verifyIdToken(idToken);
}
