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

const InterestSubjectListSchema = z.array(InterestSubjectSchema);

// 興味分野を作成する
export async function create(name: string) {
  return await credFetch("POST", endpoints.subjects, { name });
}

// 自身の興味分野を取得する
export function useMyInterests(): Hook<InterestSubject[]> {
  return useCustomizedSWR(
    "interests::mine",
    getMySubjects,
    InterestSubjectListSchema,
  );
}

async function getMySubjects(): Promise<InterestSubject[]> {
  const res = await credFetch("GET", endpoints.subjectsMine);
  return res.json();
}

// 自身の興味分野を更新する
export async function update(newSubjectIds: InterestSubjectID[]) {
  const url = endpoints.subjectsMine;
  return await credFetch("PUT", url, { subjectIds: newSubjectIds });
}

// 指定した userId のユーザの興味分野を取得
export async function get(id: UserID): Promise<InterestSubject[] | null> {
  const res = await credFetch("GET", endpoints.subjectsUserId(id));
  return await res.json();
}

// すべての興味分野を取得
export async function getAll(): Promise<InterestSubject[]> {
  const res = await credFetch("GET", endpoints.subjectsAll);
  return await res.json();
}
