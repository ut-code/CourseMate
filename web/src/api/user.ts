import endpoints from "./internal/endpoints.ts";
import type { GUID, User, UserID } from "../../../common/types";
import { doWithIdToken, ErrUnauthorized } from "../firebase/auth/lib.ts";

// TODO: migrate to safe functions

//全てのユーザ情報を取得する
export async function all(): Promise<User[]> {
  const res = await fetch(endpoints.users, {
    credentials: "include",
  });
  // TODO: typia
  return res.json();
}

// 自身のユーザー情報を取得する
export async function aboutMe(): Promise<User> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.me, {
      credentials: "include",
    });
    if (res.status === 401) throw new ErrUnauthorized();
    return res.json();
  });
}

// 自身のユーザ情報を更新する
export async function update(newData: User): Promise<void> {
  return await doWithIdToken(async () => {
    const url = endpoints.me;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
      credentials: "include",
    });

    if (res.status === 401) throw new ErrUnauthorized();
    if (!res.ok) {
      throw new Error("Network res was not ok");
    }
  });
}

// 自身のユーザ情報を削除する
export async function remove(): Promise<void> {
  return await doWithIdToken(async () => {
    const url = endpoints.me;
    const res = await fetch(url, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.status === 401) throw new ErrUnauthorized();

    if (!res.ok) {
      throw new Error("Network res was not ok");
    }
  });
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
 * Google アカウントの uid を用いて CourseMate ユーザの情報を取得する。
 * @param guid Google アカウントの uid
 * @returns ユーザの情報
 * @throws network error and type error
 */
export async function getByGUID(guid: GUID): Promise<User | null> {
  return await doWithIdToken<User | null>(async () => {
    const res = await fetch(endpoints.userByGUID(guid), {
      credentials: "include",
    });
    if (res.status === 404) {
      return null;
    }
    const data = await res.json();
    // TODO: properly convert this into User instead of assigning any
    return data;
  });
}

//指定した guid のユーザが存在するかどうかを取得する
export async function exists(guid: GUID): Promise<boolean> {
  const res = await fetch(endpoints.userExists(guid), {
    credentials: "include",
  });
  if (res.status === 404) return false;
  return true;
}

// 指定した id のユーザ情報を取得する
export async function get(id: UserID): Promise<User | null> {
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
    credentials: "include",
  });
  if (!res.ok) {
    console.error("res.ok was not true");
    throw new Error("res.ok was not true");
  }
  const user = res.json();
  return user;
}

export default {
  get,
  aboutMe,
  getByGUID,
  all,
  except,
  exists,
  create,
  update,
  remove,
};
