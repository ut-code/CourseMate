import endpoints, { UserID } from "./internal/endpoints";

//指定したユーザにリクエストを送る
export async function send(receiverId: UserID) {
  const res = await fetch(endpoints.sendRequest(receiverId), {
    method: "PUT",
  });
  return res.text();
}

//相手からのリクエストを拒否する
export async function reject(opponentID: UserID) {
  const response = await fetch(endpoints.acceptRequest(opponentID), {
    method: "PUT",
  });
  const data = await response.text();
  return data;
}

//相手からのリクエストを受け入れる
export async function accept(senderId: number) {
  const response = await fetch(endpoints.rejectRequest(senderId), {
    method: "PUT",
  });
  const data = await response.text();
  return data;
}

export default {
  send,
  reject,
  accept,
};
