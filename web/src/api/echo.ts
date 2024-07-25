import { type IdToken } from "../firebase/auth/lib";
import endpoints from "./internal/endpoints";

// throws if res.status !== 204
export async function setIdTokenCookie(idToken: IdToken) {
  const res = await fetch(endpoints.echoSetCookie, {
    body: JSON.stringify({
      "id-token": idToken,
    }),
  });
  if (res.status === 204)
    return; // OK
  else throw new Error("res.status was not 204; instead was " + res.status);
}
