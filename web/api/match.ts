import { credFetch } from "../firebase/auth/lib";
import endpoints from "./internal/endpoints";
import type { UserID } from "./internal/endpoints";

// throws error on network error
//指定したマッチング相手とのマッチング関係を削除する
export async function deleteMatch(opponentID: UserID) {
  const res = await credFetch("DELETE", endpoints.match(opponentID));
  const data = await res.text();
  return data;
}

export default {
  deleteMatch,
};
