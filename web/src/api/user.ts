import { z } from "zod";
import type { GUID, UpdateUser, User, UserID } from "../common/types";
import { parseUser } from "../common/zod/methods.ts";
import { UserIDSchema, UserSchema } from "../common/zod/schemas.ts";
import { credFetch } from "../firebase/auth/lib.ts";
import { useAuthorizedData } from "../hooks/useData.ts";
import { type Hook, useSWR } from "../hooks/useSWR.ts";
import endpoints from "./internal/endpoints.ts";
import type { Hook as UseHook } from "./share/types.ts";

const UserListSchema = z.array(UserSchema);

export function useRecommended(): UseHook<User[]> {
  const url = endpoints.recommendedUsers;
  return useAuthorizedData<User[]>(url);
}
export function useMatched(): Hook<User[]> {
  return useSWR("users::matched", matched, UserListSchema);
}
export function usePendingToMe(): Hook<User[]> {
  return useSWR("users::pending::to-me", pendingToMe, UserListSchema);
}
export function usePendingFromMe(): Hook<User[]> {
  return useSWR("users::pending::from-me", pendingFromMe, UserListSchema);
}

async function matched(): Promise<User[]> {
  const res = await credFetch("GET", endpoints.matchedUsers);
  return res.json();
}
async function pendingToMe(): Promise<User[]> {
  const res = await credFetch("GET", endpoints.pendingRequestsToMe);
  return await res.json();
}
async function pendingFromMe(): Promise<User[]> {
  const res = await credFetch("GET", endpoints.pendingRequestsFromMe);
  return await res.json();
}

// 自身のユーザー情報を取得する
export function useAboutMe(): Hook<User> {
  return useSWR("users::aboutMe", aboutMe, UserSchema);
}

async function aboutMe(): Promise<User> {
  const res = await credFetch("GET", endpoints.me);
  return res.json();
}

// 自身のユーザーIDを取得する
export function useMyID(): Hook<UserID> {
  return useSWR("users::myId", getMyId, UserIDSchema);
}
async function getMyId(): Promise<UserID> {
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

    try {
      const data = await res.json();
      try {
        const safeData = parseUser(data);
        return { status: res.status, data: safeData };
      } catch {
        return { status: res.status, data };
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//指定した guid のユーザが存在するかどうかを取得する
export async function exists(guid: GUID): Promise<boolean> {
  const res = await credFetch("GET", endpoints.userExists(guid));
  if (res.status === 404) return false;
  if (res.status === 200) return true;
  throw new Error(
    `Unexpected status code: expected 200 or 404, got ${res.status}`,
  );
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

export async function deleteAccount(): Promise<void> {
  const res = await credFetch("DELETE", endpoints.me);
  if (res.status !== 204)
    throw new Error(
      `failed to delete account: expected status code 204, but got ${res.status} with text ${await res.text()}`,
    );
}
