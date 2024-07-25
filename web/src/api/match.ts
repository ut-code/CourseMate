import { doWithIdToken, ErrUnauthorized } from "../firebase/auth/lib";
import endpoints from "./internal/endpoints";
import type { UserID } from "./internal/endpoints";

// throws error on network error
//指定したマッチング相手とのマッチング関係を削除する
export async function deleteMatch(opponentID: UserID) {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.match(opponentID), {
      method: "DELETE",
    });
    if (res.status === 401) throw new ErrUnauthorized();

    const data = await res.text();
    return data;
  });
}

export default {
  deleteMatch,
};
