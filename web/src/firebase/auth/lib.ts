import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import type { IDToken } from "../../common/types";

export class ErrUnauthorized extends Error {}

export async function getIdToken(): Promise<IDToken> {
  const auth = getAuth();
  const user = await new Promise<User>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user != null) {
        resolve(user);
        unsubscribe();
      } else {
        console.error("getIdToken: user is null");
      }
    });
  });

  if (user == null) {
    throw new Error(
      "Client Error: firebase/auth/lib.ts: current user not found",
    );
  }

  return await user.getIdToken(true);
}

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/*
  do NOT include query params such as `https://domain/path?query=param`, otherwise the URL will be invalid.
  if you (really) want to include the query parameter, then you have two options:
  - fix this function s.t. this function can take query params as arg and encode it
  - fix the implementation s.t. it pass tokens in Request-Header (don't forget to fix server/firebase/auth/lib)
*/
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

  // if (res.status === 401) throw new ErrUnauthorized();
  // if (!res.ok) throw new Error("response was not ok");
  return res;
}
