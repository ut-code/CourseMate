import { z } from "zod";
import type { Course } from "../../common/types";
import { CourseSchema } from "../../common/zod/schemas";
import { type Hook, useCustomizedSWR } from "../hooks/useCustomizedSWR";
import { getMyCourses } from "./course";

const CourseListSchema = z.array(CourseSchema);
export function useMyCourses(): Hook<Course[]> {
  return useCustomizedSWR("useMyCourses", getMyCourses, CourseListSchema);
}
