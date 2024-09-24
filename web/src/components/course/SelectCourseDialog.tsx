import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  TextField,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import courseApi from "../../api/course";
import { DAY_TO_JAPANESE_MAP } from "../../common/consts";
import type { Course, Day } from "../../common/types";
import CourseDeleteConfirmDialog from "./CourseDeleteConfirmDialog";
import CourseRegisterConfirmDialog from "./CourseRegisterConfirmDialog";

export default function SelectCourseDialog({
  open,
  onClose,
  currentEdit,
  handleCoursesUpdate,
}: {
  open: boolean;
  onClose: () => void;
  currentEdit: {
    rowIndex: number;
    columnName: Day;
    course: Course | null;
  } | null;
  handleCoursesUpdate: (courses: Course[]) => void;
}) {
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]); // その曜限で登録可能なすべての講義
  const [filteredAvailableCourses, setFilteredAvailableCourses] = useState<
    Course[]
  >([]); // 登録可能な全ての講義のうち、検索条件に合う講義
  const [newCourse, setNewCourse] = useState<Course | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] =
    useState(false);

  useEffect(() => {
    (async () => {
      if (!currentEdit) return;
      const courses = await courseApi.getCoursesByDayAndPeriod(
        currentEdit.columnName,
        currentEdit.rowIndex + 1,
      );

      setAvailableCourses(courses);
      setFilteredAvailableCourses(courses);
    })();
  }, [currentEdit]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {currentEdit
          ? `${DAY_TO_JAPANESE_MAP.get(currentEdit.columnName)}曜${currentEdit.rowIndex + 1}限の授業を選択`
          : "授業を選択"}
      </DialogTitle>
      <DialogContent>
        <>
          <Box display="flex" alignItems="center" sx={{ width: "100%" }}>
            <Typography variant="body1">
              現在の授業: {currentEdit?.course?.name ?? "-"}
            </Typography>
            <IconButton
              aria-label="delete"
              onClick={async () => {
                if (!currentEdit?.course?.id) return;

                setNewCourse(currentEdit.course);
                setIsDeleteConfirmDialogOpen(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
          <TextField
            onChange={(e) => {
              const newFilteredCourses = availableCourses.filter((course) =>
                course.name.includes(e.target.value.trim()),
              );
              setFilteredAvailableCourses(newFilteredCourses);
            }}
            label="授業名で検索"
            fullWidth
            size="small"
          />
          {filteredAvailableCourses.length === 0 ? (
            <DialogContentText>
              条件に当てはまる授業はありません。
            </DialogContentText>
          ) : (
            <Box sx={{ width: "100%" }}>
              <List>
                {filteredAvailableCourses.map((course) => (
                  <ListItem key={course.id} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        setNewCourse(course);
                        setIsConfirmDialogOpen(true);
                      }}
                    >
                      {`${course.name}(${course.teacher})`}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </>

        {newCourse && (
          <CourseRegisterConfirmDialog
            open={isConfirmDialogOpen}
            onClose={() => setIsConfirmDialogOpen(false)}
            course={newCourse}
            handleSelectDialogClose={onClose}
            handleCoursesUpdate={handleCoursesUpdate}
          />
        )}
        {newCourse && (
          <CourseDeleteConfirmDialog
            open={isDeleteConfirmDialogOpen}
            onClose={() => setIsDeleteConfirmDialogOpen(false)}
            course={newCourse}
            handleSelectDialogClose={onClose}
            handleCoursesUpdate={handleCoursesUpdate}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
}
