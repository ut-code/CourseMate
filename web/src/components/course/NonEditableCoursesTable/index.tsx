import { useCallback, useEffect, useState } from "react";

import courseApi from "../../../api/course";
import type { Course, Day, UserID } from "../../../common/types";
import FullScreenCircularProgress from "../../common/FullScreenCircularProgress";
import CoursesTableCore from "../components/CoursesTableCore";

type Props = {
  userId: UserID;
};

export default function NonEditableCoursesTable(props: Props) {
  const { userId } = props;

  const [transposedRows, setTransposedRows] = useState<
    | {
        [day in Day]: Course | null;
      }[]
    | null
  >(null);

  const handleCoursesUpdate = useCallback((courses: Course[]) => {
    const newCourses: {
      [day in Day]: Course | null;
    }[] = Array.from({ length: 6 }, () => ({
      mon: null,
      tue: null,
      wed: null,
      thu: null,
      fri: null,
      sat: null,
      sun: null,
      other: null,
    }));
    for (const course of courses) {
      for (const slot of course.slots) {
        const { day, period } = slot;
        newCourses[period - 1][day] = course;
      }
    }
    setTransposedRows(newCourses);
  }, []);

  useEffect(() => {
    (async () => {
      const courses = await courseApi.getCoursesByUserId(userId);
      handleCoursesUpdate(courses);
    })();
  }, [userId, handleCoursesUpdate]);

  return !transposedRows ? (
    <FullScreenCircularProgress />
  ) : (
    <CoursesTableCore rows={transposedRows} />
  );
}
