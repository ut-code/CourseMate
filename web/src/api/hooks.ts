import endpoints from "./internal/endpoints";
import useData from "../hooks/useData";
import type { User } from "../../../common/types";

type Hook<T> = {
  data: T | null,
  isLoading: boolean,
  error: Error | null,
  fetchData: () => void,
}

export function matchedUsers(): Hook<User[]> {
  const url = endpoints.matches;
  return useData<User[]>(url);
}

export function pendingRequests(): Hook<User[]> {
  const url = endpoints.requests;
  return useData<User[]>(url);
}

export default {
  matchedUsers,
  pendingRequests,
}
