import endpoints from "./internal/endpoints.ts";
import type { CourseID, CourseWithDayPeriods } from "../common/types";
import { doWithIdToken, ErrUnauthorized } from "../firebase/auth/lib.ts";

// TODO: migrate to safe functions

// 自身の履修情報を更新する
export async function update(
  newData: CourseID[],
): Promise<CourseWithDayPeriods[]> {
  return await doWithIdToken(async () => {
    const url = endpoints.enrollments;
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
    return res.json();
  });
}

export default {
  update,
};
