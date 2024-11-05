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
import courseApi from "../../../api/course";
import { DAY_TO_JAPANESE_MAP } from "../../../common/consts";
import type { Course, Day } from "../../../common/types";
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
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {currentEdit
          ? `${DAY_TO_JAPANESE_MAP.get(currentEdit.columnName)}曜${
              currentEdit.rowIndex + 1
            }限の授業を選択`
          : "授業を選択"}
      </DialogTitle>
      <DialogContent>
        <>
          <Box>
            <Box px={1} pb={2}>
              <Typography variant="caption">現在の授業</Typography>
              {currentEdit?.course ? (
                <Box display="flex" alignItems="center" sx={{ width: "100%" }}>
                  <Box flex={1}>
                    <Typography variant="body1">
                      {currentEdit?.course?.name ?? "-"}
                    </Typography>
                    <Typography variant="body2">{`${currentEdit?.course?.teacher ?? "-"} / ${
                      currentEdit?.course?.id ?? "-"
                    }`}</Typography>
                  </Box>
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
              ) : (
                <Typography>未登録</Typography>
              )}
            </Box>
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
                      <Box>
                        <Typography>{course.name}</Typography>
                        <Typography variant="caption">{`${course.teacher} / ${course.id}`}</Typography>
                      </Box>
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
