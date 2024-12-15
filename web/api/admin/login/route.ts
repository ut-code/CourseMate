import { credFetch } from "../../../firebase/auth/lib";
import endpoints from "../../internal/endpoints";

export async function adminLogin(userName: string, password: string) {
  const body = { userName, password };

  const res = await credFetch("POST", endpoints.adminLogin, body);

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "ログインに失敗しました。");
  }

  return res.json();
}
