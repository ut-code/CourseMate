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
import { deleteMyCourse, getMyCoursesOverlapWith } from "../../../api/course";
import type { Course } from "../../../common/types";

export default function CourseDeleteRegisterConfirmDialog({
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

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!course) return;

    setIsLoading(true);
    setOverlapCourses([]);

    (async () => {
      const courses = await getMyCoursesOverlapWith(course.id);
      setOverlapCourses(courses);
      setIsLoading(false);
    })();
  }, [course]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>削除の確認</DialogTitle>
      <DialogContent>
        <DialogContentText>
          次の授業を削除します。よろしいですか？
        </DialogContentText>
        <Box mt={1}>
          {isLoading ? (
            <Alert color="info" icon={false} severity="info" sx={{ mt: 1 }}>
              読み込み中...
            </Alert>
          ) : (
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
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        {course && (
          <Button
            onClick={async () => {
              const newCourses = await deleteMyCourse(course.id);
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
