import { type IDToken } from "../.././../common/types";
import endpoints from "./internal/endpoints";

// throws if res.status !== 204
export async function setIdTokenCookie(idToken: IDToken) {
  const res = await fetch(endpoints.echoSetCookie, {
    body: JSON.stringify({
      "id-token": idToken,
    }),
  });
  if (res.status === 204)
    return; // OK
  else throw new Error("res.status was not 204; instead was " + res.status);
}
