import endpoints from "./endpoints";

// throws error on network error
export async function deleteMatch(senderId: number, receiverId: number) {
  try {
    const response = await fetch(
      endpoints.singlematch(senderId, receiverId),
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
