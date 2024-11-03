import { useEffect, useState } from "react";

import courseApi from "../../../api/course";
import type { Course, Day, UserID } from "../../../common/types";
import FullScreenCircularProgress from "../../common/FullScreenCircularProgress";
import CoursesTableCore from "../components/CoursesTableCore";
import SelectCourseDialog from "../components/SelectCourseDialog";

type Props = {
  userId: UserID;
};

export default function EditableCoursesTable(props: Props) {
  const { userId } = props;
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [isSelectCourseDialogOpen, setIsSelectCourseDialogOpen] =
    useState(false);
  const [currentEdit, setCurrentEdit] = useState<{
    rowIndex: number;
    columnName: Day;
    course: Course | null;
  } | null>(null);

  async function handleSelectCourseDialogOpen(
    rowIndex: number,
    columnName: Day,
    course: Course | null,
  ) {
    setCurrentEdit({ rowIndex, columnName, course });
    setIsSelectCourseDialogOpen(true);
  }

  useEffect(() => {
    (async () => {
      const courses = await courseApi.getCoursesByUserId(userId);
      setCourses(courses);
    })();
  }, [userId]);

  return !courses ? (
    <FullScreenCircularProgress />
  ) : (
    <>
      <CoursesTableCore
        courses={courses}
        isButton
        onCellClick={handleSelectCourseDialogOpen}
      />
      <SelectCourseDialog
        open={isSelectCourseDialogOpen}
        onClose={() => setIsSelectCourseDialogOpen(false)}
        currentEdit={currentEdit}
        handleCoursesUpdate={setCourses}
      />
    </>
  );
}
