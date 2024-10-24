import { useEffect, useState } from "react";

import courseApi from "../../../api/course";
import type { Course, UserID } from "../../../common/types";
import FullScreenCircularProgress from "../../common/FullScreenCircularProgress";
import CoursesTableCore from "../components/CoursesTableCore";

type Props = {
  userId: UserID;
  comparisonUserId?: UserID;
};

export default function NonEditableCoursesTable(props: Props) {
  const { userId, comparisonUserId } = props;
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [comparisonCourses, setComparisonCourses] = useState<Course[] | null>(
    null,
  );

  useEffect(() => {
    (async () => {
      const newCourses = await courseApi.getCoursesByUserId(userId);
      setCourses(newCourses);
      if (comparisonUserId) {
        const comparisonCourses =
          await courseApi.getCoursesByUserId(comparisonUserId);
        setComparisonCourses(comparisonCourses);
      }
    })();
  }, [userId, comparisonUserId]);

  return !courses ? (
    <FullScreenCircularProgress />
  ) : (
    <CoursesTableCore
      courses={courses}
      comparisonCourses={comparisonCourses ? comparisonCourses : undefined}
    />
  );
}
