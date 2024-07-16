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
  } catch {
    console.error();
  }
}

export default {
  deleteMatch,
}
