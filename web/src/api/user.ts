import type { GUID, UpdateUser, User, UserID } from "../common/types";
import { parseUser } from "../common/zod/methods.ts";
import { credFetch } from "../firebase/auth/lib.ts";
import endpoints from "./internal/endpoints.ts";

// TODO: migrate to safe functions

//全てのユーザ情報を取得する
export async function all(): Promise<User[]> {
  const res = await credFetch("GET", endpoints.users);
  const users = await res.json();
  const safeUsers: User[] = users.map((user: User) => parseUser(user));
  return safeUsers;
}

export async function matched(): Promise<User[]> {
  const res = await credFetch("GET", endpoints.matchedUsers);
  return res.json();
}

// 自身のユーザー情報を取得する
export async function aboutMe(): Promise<User> {
  const res = await credFetch("GET", endpoints.me);
  return res.json();
}

// 自身のユーザーIDを取得する
export async function getMyId(): Promise<UserID> {
  const me = await aboutMe();
  return me.id;
}

// 自身のユーザ情報を更新する
export async function update(newData: UpdateUser): Promise<void> {
  const url = endpoints.me;
  await credFetch("PUT", url, newData);
}

// 自身のユーザ情報を削除する
export async function remove(): Promise<void> {
  await credFetch("DELETE", endpoints.me);
}

//指定した id のユーザ情報を除いた全てのユーザ情報を取得する
export async function except(id: UserID): Promise<User[]> {
  try {
    const data = await all();
    return data.filter((user: User) => user.id !== id);
  } catch (err) {
    console.error("Error fetching data:", err);
    throw err;
  }
}

/**
 * Google アカウントの uid を用いて CourseMate ユーザの情報とステータスコードを取得する。
 * @param guid Google アカウントの uid
 * @returns ユーザの情報とそのステータスコード
 * @throws network error and type error
 */
export async function getByGUID(
  guid: GUID,
): Promise<{ status: number; data: User | null }> {
  try {
    const res = await credFetch("GET", endpoints.userByGUID(guid));

    if (!res.ok) {
      return { status: res.status, data: null };
    }

    const data = await res.json();
    const safeData = parseUser(data);
    return { status: res.status, data: safeData };
  } catch (error) {
    throw new Error("ネットワークエラーまたは型エラーが発生しました");
  }
}

//指定した guid のユーザが存在するかどうかを取得する
export async function exists(guid: GUID): Promise<boolean> {
  try {
    const res = await credFetch("GET", endpoints.userExists(guid));
    if (res.status === 404) return false;
    return true;
  } catch {
    return false;
  }
}

// 指定した id のユーザ情報を取得する
export async function get(id: UserID): Promise<User | null> {
  const res = await credFetch("GET", endpoints.user(id));
  return await res.json();
}

//ユーザ情報を作成する
export async function create(userdata: Omit<User, "id">): Promise<User> {
  const res = await credFetch("POST", endpoints.users, userdata);
  return await res.json();
}

export default {
  get,
  aboutMe,
  getByGUID,
  all,
  matched,
  except,
  exists,
  create,
  update,
  remove,
};
