import endpoints from "./internal/endpoints.ts";
import type { User } from "../../../common/types";

//全てのユーザ情報を取得する
export async function all(): Promise<User[]> {
  const res = await fetch(endpoints.users);
  return res.json();
}

//指定した id のユーザ情報を除いた全てのユーザ情報を取得する
export async function except(id: number): Promise<User[]> {
  try {
    const data = await all();
    return data.filter((user: User) => user.id !== id);
  } catch (err) {
    console.error("Error fetching data:", err);
    throw err;
  }
}

/**
 * Google アカウントの uid を用いて CourseMate ユーザの情報を取得する。
 * @param uid Google アカウントの uid
 * @returns ユーザの情報
 * @throws network error and type error
 */
export async function getByGUID(guid: string): Promise<User | null> {
  const res = await fetch(endpoints.userByGUID(guid));
  if (res.status === 404) {
    return null;
  }
  const data = await res.json();
  // TODO: properly convert this into User instead of assigning any
  return data;
}

//指定した guid のユーザが存在するかどうかを取得する
export async function exists(guid: string): Promise<boolean> {
  const res = await fetch(endpoints.userExists(guid));
  if (res.status === 404) return false;
  return true;
}

//指定した id のユーザ情報を取得する
export async function get(id: number): Promise<User | null> {
  const res = await fetch(endpoints.user(id));
  if (res.status === 404) {
    return null;
  }
  const data = await res.json();
  // TODO: properly convert this into User instead of assigning any
  return data;
}

//ユーザ情報を作成する
export async function create(userdata: Omit<User, "id">): Promise<User> {
  const res = await fetch(endpoints.users, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userdata),
  });
  if (!res.ok) {
    console.error("res.ok was not true");
    throw new Error("res.ok was not true");
  }
  const user = res.json();
  return user;
}

//ユーザ情報を更新する
export async function update(userId: number, newData: User): Promise<void> {
  try {
    const url = endpoints.user(userId);
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });

    if (!res.ok) {
      throw new Error("Network res was not ok");
    }
  } catch (error) {
    console.error("Error updating user information:", error);
  }
}

//ユーザ情報を削除する
export async function remove(userId: number): Promise<void> {
  try {
    const url = endpoints.user(userId);
    const res = await fetch(url, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Network res was not ok");
    }
  } catch (error) {
    console.error("Error deleting user information:", error);
  }
}

export default {
  get,
  getByGUID,
  all,
  except,
  exists,
  create,
  update,
  remove,
};
