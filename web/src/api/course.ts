import { Day, Course } from "../common/types";
import endpoints from "./internal/endpoints";

// TODO: migrate to safe functions

// 曜限を指定して講義情報を取得する
export async function getByDayPeriod({
  day,
  period,
}: {
  day: Day;
  period: number;
}): Promise<Course[]> {
  const res = await fetch(endpoints.coursesByDayPeriod(day, period), {
    credentials: "include",
  });
  return res.json();
}

export default {
  getByDayPeriod,
};
