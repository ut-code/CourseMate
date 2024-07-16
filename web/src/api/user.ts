import endpoints from "./endpoints.ts";
import type { User } from "../../../common/types";

/**
 * Google アカウントの uid を用いて CourseMate ユーザの情報を取得する。
 * @param uid Google アカウントの uid
 * @returns ユーザの情報
 */
export async function get(userId: number | string): Promise<User | null> {
  if (typeof userId === "string") userId = parseInt(userId);
  if (isNaN(userId)) throw new Error("userId is NaN");

  const response = await fetch(endpoints.user(userId));
  if (response.status === 404) {
    return null;
  }
  const data = await response.json();
  // TODO: properly convert this into User instead of assigning any
  return data;
}

async function update(userId: number, newData: User): Promise<void> {
  try {
    const url = endpoints.user(userId);
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.error('Error updating user information:', error);
  }
}

export default {
  get,
  update,
}
