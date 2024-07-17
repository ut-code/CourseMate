export async function reject(senderId: number, receiverId: number) {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_ENDPOINT
      }/requests/reject/${senderId.toString()}/${receiverId.toString()}`,
      {
        method: "PUT",
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function accept(senderId: number, receiverId: number) {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_ENDPOINT
      }/requests/accept/${senderId.toString()}/${receiverId.toString()}`,
      {
        method: "PUT",
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export default {
  reject,
  accept,
};
