import { ErrUnauthorized, credFetch } from "../../../firebase/auth/lib";
import endpoints from "../../internal/endpoints";

export async function adminAuth() {
  const res = await credFetch("GET", endpoints.adminLogin);
  if (res.status === 401) throw new ErrUnauthorized();
  return res.json();
}
