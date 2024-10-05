import { useEffect, useState } from "react";

import courseApi from "../../../api/course";
import type { Course, UserID } from "../../../common/types";
import FullScreenCircularProgress from "../../common/FullScreenCircularProgress";
import CoursesTableCore from "../components/CoursesTableCore";

type Props = {
  userId: UserID;
};

export default function NonEditableCoursesTable(props: Props) {
  const { userId } = props;
  const [courses, setCourses] = useState<Course[] | null>(null);

  useEffect(() => {
    (async () => {
      const courses = await courseApi.getCoursesByUserId(userId);
      setCourses(courses);
    })();
  }, [userId]);

  return !courses ? (
    <FullScreenCircularProgress />
  ) : (
    <CoursesTableCore courses={courses} />
  );
}
