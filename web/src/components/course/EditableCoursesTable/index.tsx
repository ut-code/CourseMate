import { useCallback, useEffect, useState } from "react";

import courseApi from "../../../api/course";
import type { Course, Day, UserID } from "../../../common/types";
import FullScreenCircularProgress from "../../common/FullScreenCircularProgress";
import SelectCourseDialog from "../SelectCourseDialog";
import CoursesTableCore from "../components/CoursesTableCore";

type Props = {
  userId: UserID;
  editable?: boolean;
};

export default function EditableCoursesTable(props: Props) {
  const { userId, editable = false } = props;
  const [isSelectCourseDialogOpen, setIsSelectCourseDialogOpen] =
    useState(false);
  const [currentEdit, setCurrentEdit] = useState<{
    rowIndex: number;
    columnName: Day;
    course: Course | null;
  } | null>(null);

  const [transposedRows, setTransposedRows] = useState<
    | {
        [day in Day]: Course | null;
      }[]
    | null
  >(null);

  async function handleSelectCourseDialogOpen(
    rowIndex: number,
    columnName: Day,
    course: Course | null,
  ) {
    setCurrentEdit({ rowIndex, columnName, course });
    setIsSelectCourseDialogOpen(true);
  }

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
    <>
      <CoursesTableCore
        rows={transposedRows}
        isButton={editable}
        onCellClick={handleSelectCourseDialogOpen}
      />
      {editable && (
        <SelectCourseDialog
          open={isSelectCourseDialogOpen}
          onClose={() => setIsSelectCourseDialogOpen(false)}
          currentEdit={currentEdit}
          handleCoursesUpdate={handleCoursesUpdate}
        />
      )}
    </>
  );
}
