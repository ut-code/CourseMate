import endpoints from "./internal/endpoints";

export async function send(receiverId: number) {
  const res = await fetch(
    endpoints.sendRequest(receiverId),
    {
      method: "POST",
    });
  return res.json();
}

export async function reject(senderId: number, receiverId: number) {
  try {
    const response = await fetch(
      endpoints.rejectRequest(senderId, receiverId),
      {
        method: "PUT",
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
    const response = await fetch(
      endpoints.acceptRequest(senderId),
      {
        method: "PUT",
      },
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err
  }
}

export default {
  send,
  reject,
  accept,
};
