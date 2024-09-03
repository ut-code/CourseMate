import { getAuth } from "firebase/auth";
import { type IDToken } from "../../common/types";

export class ErrUnauthorized extends Error {}

async function sleep(for_ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, for_ms);
  });
}

// sometimes throws.
export async function getIdToken(): Promise<IDToken> {
  // retry 10 times before throwing, because React seems to be doing something weird
  // it seems like someone forgot await, but it's not us so no clue
  for (let i = 0; i < 10; i++) {
    console.log(`getIdToken(): ${i + 1}th try getting currentUser`);
    const currentUser = getAuth().currentUser;
    if (currentUser == null) {
      await sleep(100);
      console.log(`getIdToken: ${i + 1}th try failed`);
      continue;
    }
    const idtoken = await currentUser.getIdToken();
    console.log(`getIdToken: ${i + 1}th try succeeded`);
    return idtoken;
  }
  throw new Error("Client Error: firebase/auth/lib.ts: current user not found");
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

  if (res.status == 401) throw new ErrUnauthorized();
  if (!res.ok) throw new Error("response was not ok");
  return res;
}
