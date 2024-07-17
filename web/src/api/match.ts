// throws error on network error
export async function deleteMatch(senderId: number, receiverId: number) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/matches/${senderId}/${receiverId}`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export default {
  deleteMatch,
}
