import type { Course } from "../common/types";
import { type Hook, useSWR } from "../hooks/useSWR";
import { getMyCourses } from "./course";

export function useMyCourses(): Hook<Course[]> {
  return useSWR("COURSEMATE_CACHE__useMyCourse()", () => getMyCourses());
}
