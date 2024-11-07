import { credFetch } from "~/firebase/auth/lib";
import endpoints, { type UserID } from "./internal/endpoints";

//指定したユーザにリクエストを送る
export async function send(receiverId: UserID) {
  const res = await credFetch("PUT", endpoints.sendRequest(receiverId));
  return res.text();
}

export async function cancel(receiverId: UserID) {
  const res = await credFetch("PUT", endpoints.cancelRequest(receiverId));
  return await res.text();
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
