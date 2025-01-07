import type {
  InterestSubject,
  InterestSubjectID,
  UserID,
} from "common/types.ts";
import { InterestSubjectSchema } from "common/zod/schemas.ts";
import { z } from "zod";
import { credFetch } from "../firebase/auth/lib.ts";
import { type Hook, useCustomizedSWR } from "../hooks/useCustomizedSWR.ts";
import endpoints from "./internal/endpoints.ts";

// 自身の興味分野を取得する
export function useMyInterests(): Hook<InterestSubject[]> {
  return useCustomizedSWR(
    "interests::mine",
    getMySubjects,
    z.array(InterestSubjectSchema),
  );
}

async function getMySubjects(): Promise<InterestSubject[]> {
  const res = await credFetch("GET", endpoints.subjectsMine);
  return res.json();
}

// 自身の興味分野を更新する
export async function update(
  newSubjectIds: InterestSubjectID[],
): Promise<void> {
  const url = endpoints.subjectsMine;
  await credFetch("PUT", url, { subjectIds: newSubjectIds });
}

// 指定した userId のユーザの興味分野を取得
export async function get(id: UserID): Promise<InterestSubject[] | null> {
  const res = await credFetch("GET", endpoints.subjectsUserId(id));
  return await res.json();
}

// キーワードで興味分野を検索
export function useSearch(q: string): Hook<InterestSubject[]> {
  return useCustomizedSWR(
    `interests::search::${q}`,
    () => search(q),
    z.array(InterestSubjectSchema),
  );
}

export async function search(q: string): Promise<InterestSubject[]> {
  const res = await credFetch("GET", endpoints.subjectsSearch(q));
  return await res.json();
}
