import { type IDToken } from "../.././../common/types";
import endpoints from "./internal/endpoints";

// throws if res.status !== 204
export async function setIdTokenCookie(idToken: IDToken) {
  const res = await fetch(`${endpoints.echoSetCookie}?id-token=${idToken}`, {
    // https://stackoverflow.com/questions/72612730/browser-is-not-saving-cookie
    // try setting 'credentials: "include"' in your fetch request that is EXPECTING A COOKIE IN THE RESPONSE.
    credentials: "include",
  });
  if (res.status === 204)
    return; // OK
  else throw new Error("res.status was not 204; instead was " + res.status);
}
