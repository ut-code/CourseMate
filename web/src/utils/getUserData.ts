import { User } from "../../../common/types";

/**
 * Google アカウントの uid を用いて CourseMate ユーザの情報を取得する。
 * @param uid Google アカウントの uid
 * @returns ユーザの情報
 */
export async function getUserData(uid: string): Promise<User | null> {
  const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/users/${uid}`);
  if (response.status === 404) {
    return null;
  }
  const data = await response.json();
  return data;
}
