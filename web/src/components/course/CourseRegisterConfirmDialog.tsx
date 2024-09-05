import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { Course, CourseDayPeriod } from "../../common/types";
import { getOverlappingCourses, modifyEnrollments } from "../../api/course";
import { useEffect, useState } from "react";

export default function CourseRegisterConfirmDialog({
  open,
  onClose,
  course,
  handleSelectDialogClose,
  handleCoursesUpdate,
}: {
  open: boolean;
  onClose: () => void;
  course: Course | null;
  handleSelectDialogClose: () => void;
  handleCoursesUpdate: (
    courses: (Course & { courseDayPeriods: CourseDayPeriod[] })[],
  ) => void;
}) {
  const [overlapCourses, setOverlapCourses] = useState<Course[]>([]);

  useEffect(() => {
    (async () => {
      const courses = await getOverlappingCourses(course?.id ?? "");
      console.log(courses);
      setOverlapCourses(courses);
    })();
  }, [course]);

  // TODO: courseId は null ではないのでいい感じに型をやる
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        追加される授業: {course?.name}
        削除される授業:{" "}
        {overlapCourses.map((overlapCourse) => overlapCourse.name).join(", ")}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button
          onClick={async () => {
            const newCourses = await modifyEnrollments(course?.id ?? "");
            handleCoursesUpdate(newCourses);
            handleSelectDialogClose();
          }}
        >
          登録
        </Button>
      </DialogActions>
    </Dialog>
  );
}
