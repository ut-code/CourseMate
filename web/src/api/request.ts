import { doWithIdToken, ErrUnauthorized } from "../firebase/auth/lib";
import endpoints, { UserID } from "./internal/endpoints";

//指定したユーザにリクエストを送る
export async function send(receiverId: UserID) {
  return doWithIdToken(async () => {
    const res = await fetch(endpoints.sendRequest(receiverId), {
      method: "PUT",
      credentials: "include",
    });
    if (res.status === 401) throw new ErrUnauthorized();

    return res.text();
  });
}

//相手からのリクエストを拒否する
export async function reject(opponentID: UserID) {
  return doWithIdToken(async () => {
    const res = await fetch(endpoints.acceptRequest(opponentID), {
      method: "PUT",
      credentials: "include",
    });
    if (res.status === 401) throw new ErrUnauthorized();
    const data = await res.text();
    return data;
  });
}

//相手からのリクエストを受け入れる
export async function accept(senderId: UserID) {
  return doWithIdToken(async () => {
    const res = await fetch(endpoints.rejectRequest(senderId), {
      method: "PUT",
      credentials: "include",
    });
    if (res.status === 401) throw new ErrUnauthorized();
    const data = await res.text();
    return data;
  });
}

export default {
  send,
  reject,
  accept,
};
