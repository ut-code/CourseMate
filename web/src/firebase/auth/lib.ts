import { getAuth } from "firebase/auth";
import { type IDToken } from "../../common/types";

export class ErrUnauthorized extends Error {}

// sometimes throws.
export async function getIdToken(): Promise<IDToken> {
  const currentUser = getAuth().currentUser;
  if (currentUser == null) throw new Error("current user not found");
  const idtoken = await currentUser.getIdToken();
  return idtoken;
}

/**
 * given func runs at most twice. do not mutate external variables inside the function.
 * throws error when:
 * - it failed to get id token
 * - the func threw an error that is not ErrUnauthorized
 * - the func failed with id token
 **/

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export async function credFetch(
  method: RequestMethod,
  path: string,
  body?: unknown,
): Promise<Response> {
  const idToken = await getIdToken();
  const init: RequestInit = { method };
  if (body) {
    init.body = JSON.stringify(body);
    init.headers = {
      "Content-Type": "application/json",
    };
  }

  const res = await fetch(`${path}?token=${idToken}`, init);
  if (res.status == 401) throw new ErrUnauthorized();
  if (!res.ok) throw new Error("response was not ok");
  return res;
}
