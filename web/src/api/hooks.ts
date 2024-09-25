import type { User } from "../common/types";
import { UserSchema } from "../common/zod/schemas";
import { credFetch } from "../firebase/auth/lib";
import { useAuthorizedData } from "../hooks/useData";
import { useSWR } from "../hooks/useSWR";
import type { Hook as SWRHook } from "../hooks/useSWR";
import endpoints from "./internal/endpoints";
import type { Hook } from "./share/types";

// TODO: install zod.

export function useMatchedUsers(): Hook<User[]> {
  const url = endpoints.matchedUsers;
  return useAuthorizedData<User[]>(url);
}

export function usePendingRequestsToMe(): Hook<User[]> {
  const url = endpoints.pendingRequestsToMe;
  return useAuthorizedData<User[]>(url);
}

export function usePendingRequestsFromMe(): Hook<User[]> {
  const url = endpoints.pendingRequestsFromMe;
  return useAuthorizedData<User[]>(url);
}

export function useMe(): SWRHook<User> {
  return useSWR("COURSEMATE_CACHE__useMe", getMyData, UserSchema);
}
export async function getMyData() {
  const res = await credFetch("GET", endpoints.me);
  return await res.json();
}

export default {
  useMatchedUsers,
  usePendingRequestsToMe,
  usePendingRequestsFromMe,
  useMe,
};
