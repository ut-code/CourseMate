import endpoints from "./internal/endpoints.ts";
import type { User } from "../../../common/types";

export async function all(): Promise<User[]> {
  const res = await fetch(endpoints.alluser);
  return res.json();
}

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
 */
export async function get_byguid(guid: string): Promise<User | null> {
  // TODO: fix this.
  const response = await fetch(endpoints.userByGUID(guid));
  if (response.status === 404) {
    return null;
  }
  const data = await response.json();
  // TODO: properly convert this into User instead of assigning any
  return data;
}

export async function exists(guid: string): Promise<boolean> {
  const response = await fetch(endpoints.userExists(guid));
  if (response.status === 404) return false;
  return true;
}

export async function get(id: number): Promise<User | null> {
  const response = await fetch(endpoints.user(id));
  if (response.status === 404) {
    return null;
  }
  const data = await response.json();
  // TODO: properly convert this into User instead of assigning any
  return data;
}

export async function create(userdata: User): Promise<void> {
  const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userdata),
  });
  if (!response.ok) {
    console.error("response.ok was not true");
    throw new Error("response.ok was not true");
  }
  return
}

export async function update(userId: number, newData: User): Promise<void> {
  try {
    const url = endpoints.user(userId);
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("Error updating user information:", error);
  }
}

export default {
  get,
  get_byguid,
  all,
  except,
  exists,
  create,
  update,
};
