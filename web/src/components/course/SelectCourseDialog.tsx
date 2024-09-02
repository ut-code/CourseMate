import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  List,
  Divider,
  Typography,
  ListItemButton,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import courseApi, {
  deleteEnrollment,
  modifyEnrollments,
} from "../../api/course";
import { Course, CourseDayPeriod, Day } from "../../common/types";
import { useEffect, useState } from "react";

const dayCodeToDayMap: { [dayCode in Day]: string } = {
  mon: "月",
  tue: "火",
  wed: "水",
  thu: "木",
  fri: "金",
  sat: "土",
};

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
  handleCoursesUpdate: (
    courses: (Course & {
      courseDayPeriods: CourseDayPeriod[];
    })[],
  ) => void;
}) {
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);

  useEffect(() => {
    (async () => {
      if (!currentEdit) return;
      const courses = await courseApi.getByDayPeriod({
        day: currentEdit.columnName,
        period: currentEdit.rowIndex + 1,
      });

      setAvailableCourses(courses);
    })();
  }, [currentEdit]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {currentEdit
          ? `${dayCodeToDayMap[currentEdit.columnName]}曜${currentEdit.rowIndex + 1}限の授業を選択`
          : "授業を選択"}
      </DialogTitle>
      <DialogContent>
        {availableCourses.length === 0 ? (
          <DialogContentText>この曜限の授業はありません。</DialogContentText>
        ) : (
          <>
            <Box display="flex" alignItems="center" sx={{ width: "100%" }}>
              <Typography variant="body1">現在の授業:{}</Typography>
              <IconButton
                aria-label="delete"
                onClick={async () => {
                  if (!currentEdit?.course?.id) return;
                  const newCourses = await deleteEnrollment(
                    currentEdit.course.id,
                  );
                  handleCoursesUpdate(newCourses);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Box sx={{ width: "100%" }}>
              <List>
                {availableCourses.map((course, index) => (
                  <>
                    <ListItemButton
                      key={course.id}
                      onClick={async () => {
                        if (!currentEdit) return;
                        const newCourses = await modifyEnrollments(course.id);
                        handleCoursesUpdate(newCourses);
                      }}
                    >
                      {course.name}
                    </ListItemButton>
                    {index < availableCourses.length - 1 && <Divider />}
                  </>
                ))}
              </List>
            </Box>
          </>
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
