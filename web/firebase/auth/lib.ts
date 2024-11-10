import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import type { IDToken } from "~/common/types";
import { app } from "../config";

export class ErrUnauthorized extends Error {}

let user: User;
let token: string;

const auth = getAuth(app);

// 認証状態の完了を待機するためのPromiseを作成
const authInitialized = new Promise<void>((resolve) => {
  onAuthStateChanged(auth, async (u: User | null) => {
    if (u != null) {
      user = u;
      token = await user.getIdToken();
    }
    resolve();
  });
});

async function refreshToken() {
  token = await user.getIdToken(true);
}

export async function getIdToken(): Promise<IDToken> {
  await authInitialized;
  if (token) return token;
  await refreshToken();
  return token;
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
  try {
    const idToken = await getIdToken();
    const init: RequestInit = { method };
    if (body) {
      init.body = JSON.stringify(body);
      init.headers = {
        "Content-Type": "application/json",
      };
    }

    let res: Response;
    res = await fetch(`${path}?token=${idToken}`, init);

    if (res.status === 401) {
      await refreshToken();
      res = await fetch(`${path}?token=${idToken}`, init);
    }

    return res;
  } catch (error) {
    console.error("Error in credFetch function:", error);
    throw error;
  }
}
