import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { addMyCourse, getMyCoursesOverlapWith } from "../../api/course";
import type { Course } from "../../common/types";

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
  handleCoursesUpdate: (courses: Course[]) => void;
}) {
  const [overlapCourses, setOverlapCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!course) return;
    (async () => {
      const courses = await getMyCoursesOverlapWith(course.id);
      setOverlapCourses(courses);
    })();
  }, [course]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>変更の確認</DialogTitle>
      <DialogContent>
        <DialogContentText>
          次のように変更します。よろしいですか？
        </DialogContentText>
        <Box mt={2}>
          {course && (
            <Alert color="success" icon={false} severity="info">
              {`追加: ${course.name} (${course.teacher})`}
            </Alert>
          )}
          <Alert color="error" icon={false} severity="info" sx={{ mt: 1 }}>
            {`削除: ${
              overlapCourses
                .map(
                  (overlapCourse) =>
                    `${overlapCourse.name} (${overlapCourse.teacher})`,
                )
                .join("・") || "なし"
            }`}
          </Alert>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        {course && (
          <Button
            onClick={async () => {
              const newCourses = await addMyCourse(course.id);
              handleCoursesUpdate(newCourses);
              onClose();
              handleSelectDialogClose();
            }}
          >
            確定
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
