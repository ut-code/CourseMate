import { getAuth } from "firebase/auth";
import { setIdTokenCookie } from "../../api/echo";

export type IdToken = string

// sometimes throws.
export async function getIdToken(): Promise<IdToken> {
  const currentUser = getAuth().currentUser;
  if (currentUser == null) throw new Error("current user not found");
  const idtoken = await currentUser.getIdToken();
  return  idtoken;
}

// sometimes throws error.
export async function refreshIdToken(): Promise<void> {
  const idToken = await getIdToken();
  await setIdTokenCookie(idToken);
}
