import endpoints from "./internal/endpoints";
import { useAuthorizedData } from "../hooks/useData";
import type { User } from "../common/types";
import type { Hook } from "./share/types";

// TODO: install typia or zod.

export function useMatchedUsers(): Hook<User[]> {
  const url = endpoints.matchedUsers;
  return useAuthorizedData<User[]>(url);
}

export function usePendingRequestToUser(): Hook<User[]> {
  const url = endpoints.pendingRequestToUser;
  return useAuthorizedData<User[]>(url);
}

export function usePendingRequestFromUser(): Hook<User[]> {
  const url = endpoints.pendingRequestFromUser;
  return useAuthorizedData<User[]>(url);
}

export function useMe(): Hook<User> {
  const url = endpoints.me;
  return useAuthorizedData<User>(url);
}

export default {
  useMatchedUsers,
  usePendingRequestToUser,
  usePendingRequestFromUser,
  useMe,
};
