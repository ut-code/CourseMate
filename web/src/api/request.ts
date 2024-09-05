import { credFetch } from "../firebase/auth/lib";
import endpoints, { UserID } from "./internal/endpoints";

//指定したユーザにリクエストを送る
export async function send(receiverId: UserID) {
  const res = await credFetch("PUT", endpoints.sendRequest(receiverId));
  return res.text();
}

//相手からのリクエストを拒否する
export async function reject(opponentID: UserID) {
  const res = await credFetch("PUT", endpoints.rejectRequest(opponentID));
  const data = await res.text();
  return data;
}

//相手からのリクエストを受け入れる
export async function accept(senderId: UserID) {
  const res = await credFetch("PUT", endpoints.acceptRequest(senderId));
  const data = await res.text();
  return data;
}

export default {
  send,
  reject,
  accept,
};
