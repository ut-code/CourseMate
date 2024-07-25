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

/** 
 * given func runs at most twice. do not mutate external variables inside the function.
 * throws error when:
 * - it failed to get id token
 * - the func failed with id token
 **/
export async function doWithIdToken<T>(func: () => Promise<T>): Promise<T> {
  try {
    return await func();
  } catch {
    refreshIdToken();
    return await func();
  }
}
