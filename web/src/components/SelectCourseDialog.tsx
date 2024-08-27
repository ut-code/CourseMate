import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  DialogContentText,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import courseApi, { modifyEnrollments } from "../api/course";
import { Course, CourseDayPeriod, Day } from "../common/types";
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
  currentEdit: { rowIndex: number; columnName: Day } | null;
  handleCoursesUpdate: (
    courses: (Course & {
      courseDayPeriods: CourseDayPeriod[];
    })[],
  ) => void;
}) {
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [currentSelect, setCurrentSelect] = useState<Course | null>(null);

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
          ? `${dayCodeToDayMap[currentEdit.columnName]}曜${currentEdit.rowIndex + 1}限`
          : "授業を選択"}
      </DialogTitle>
      <DialogContent>
        {availableCourses.length === 0 ? (
          <DialogContentText>この曜限の授業はありません。</DialogContentText>
        ) : (
          <>
            <DialogContentText sx={{ mb: 2 }}>
              授業を選択してください。
            </DialogContentText>
            <Box display={"flex"} sx={{ width: "100%" }}>
              <FormControl fullWidth>
                <InputLabel id="courses-by-day-period-label">授業</InputLabel>
                <Select
                  labelId="courses-by-day-period-label"
                  id="courses-by-day-period"
                  value={currentSelect?.id || ""}
                  label="Course"
                  onChange={(e) => {
                    if (!currentEdit) return;
                    setCurrentSelect({
                      id: e.target.value as Day,
                      name:
                        availableCourses.find(
                          (course) => course.id === e.target.value,
                        )?.name || "",
                    });
                  }}
                >
                  {availableCourses.map((course) => (
                    <MenuItem value={course.id}>{course.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton
                aria-label="delete"
                onClick={async () => {
                  if (!currentEdit) return;
                  const newCourses = await modifyEnrollments({
                    courseId: "",
                    day: currentEdit.columnName,
                    period: currentEdit.rowIndex + 1,
                  });
                  handleCoursesUpdate(newCourses);
                  onClose();
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          キャンセル
        </Button>
        <Button
          onClick={async () => {
            if (!currentEdit) return;
            const newCourses = await modifyEnrollments({
              courseId: currentSelect?.id || "",
              day: currentEdit.columnName,
              period: currentEdit.rowIndex + 1,
            });
            handleCoursesUpdate(newCourses);
            onClose();
          }}
          color="primary"
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
}
