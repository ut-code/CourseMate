import endpoints, { UserID } from "./internal/endpoints";

//指定したユーザにリクエストを送る
export async function send(receiverId: UserID) {
  const res = await fetch(endpoints.request(receiverId), {
    method: "POST",
  });
  return res.json();
}

//相手からのリクエストを拒否する
export async function reject(opponentID: UserID) {
  try {
    const response = await fetch(endpoints.request(opponentID), {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//相手からのリクエストを受け入れる
export async function accept(senderId: number) {
  try {
    const response = await fetch(endpoints.request(senderId), {
      method: "PUT",
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export default {
  send,
  reject,
  accept,
};
