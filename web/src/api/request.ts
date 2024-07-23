import endpoints, { UserID } from "./internal/endpoints";

export async function send(receiverId: UserID) {
  const res = await fetch(endpoints.request(receiverId), {
    method: "POST",
  });
  return res.json();
}

export async function reject(opponentID: UserID) {
  try {
    const response = await fetch(
      endpoints.request(opponentID),
      {
        method: "DELETE",
      },
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

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
