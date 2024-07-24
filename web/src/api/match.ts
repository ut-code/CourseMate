import endpoints from "./internal/endpoints";
import type { UserID } from "./internal/endpoints";

// throws error on network error
//指定したマッチング相手とのマッチング関係を削除する
export async function deleteMatch(opponentID: UserID) {
  try {
<<<<<<< Updated upstream
<<<<<<< HEAD
    const response = await fetch(endpoints.mtatch(opponentID), {
=======
    const response = await fetch(endpoints.match(opponentID), {
>>>>>>> main
=======
    const response = await fetch(endpoints.mtatch(opponentID), {
>>>>>>> Stashed changes
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export default {
  deleteMatch,
};
