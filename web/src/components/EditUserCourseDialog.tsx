import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import {
  Course,
  CourseWithDayPeriods,
  Day,
  PeriodDayCourseMap,
  UpdateUser,
} from "../common/types";
import enrollmentApi from "../api/enrollment";
import courseApi from "../api/course";
import { photo } from "./data/photo-preview";

type EditUserDialogProps = {
  isOpen: boolean;
  close: () => void;
  defaultValue: UpdateUser;
};

const defaultRows = Array(6)
  .fill(null)
  .map((_, i) => {
    return {
      name: `${i + 1}限`,
      mon: [{ id: "", name: "" }],
      tue: [{ id: "", name: "" }],
      wed: [{ id: "", name: "" }],
      thu: [{ id: "", name: "" }],
      fri: [{ id: "", name: "" }],
      sat: [{ id: "", name: "" }],
    };
  });

const dayCodeToDayMap: { [dayCode in Day]: string } = {
  mon: "月",
  tue: "火",
  wed: "水",
  thu: "木",
  fri: "金",
  sat: "土",
};

function transform(courses: CourseWithDayPeriods[]): PeriodDayCourseMap {
  const days = ["mon", "tue", "wed", "thu", "fri", "sat"];
  const result: PeriodDayCourseMap = {};
  courses.forEach((course) => {
    course.dayPeriods.forEach((dayPeriod) => {
      const { day, period } = dayPeriod;

      if (!result[period]) {
        result[period] = {};
      }
      days.forEach((day) => {
        if (!result[period][day]) {
          result[period][day] = [];
        }
      });
      result[period][day].push({ id: course.id, name: course.name });
    });
  });
  return result;
}

const EditUserCourseDialog: React.FC<EditUserDialogProps> = (
  props: EditUserDialogProps,
) => {
  const { isOpen, close } = props;

  const [isSelectCourseDialogOpen, setIsSelectCourseDialogOpen] =
    useState(false);
  const [currentEdit, setCurrentEdit] = useState<{
    rowIndex: number;
    columnName: Day;
    courses: Course[];
  } | null>(null);
  const [coursesOnCurrentDayPeriod, setCoursesOnCurrentDayPeriod] = useState<
    Course[]
  >([]);
  // const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([""]);
  const [rows, setRows] = useState<
    {
      name: string;
      mon: Course[];
      tue: Course[];
      wed: Course[];
      thu: Course[];
      fri: Course[];
      sat: Course[];
    }[]
  >(defaultRows);

  const handleOpen = async (
    rowIndex: number,
    columnName: Day,
    courses: Course[],
  ) => {
    setCurrentEdit({ rowIndex, columnName, courses });
    const coursesOnDayPeriod = await courseApi.getByDayPeriod({
      day: columnName,
      period: rowIndex + 1,
    });
    setCoursesOnCurrentDayPeriod(coursesOnDayPeriod);
    setIsSelectCourseDialogOpen(true);
  };

  const handleClose = () => setIsSelectCourseDialogOpen(false);

  const onClose = () => {
    photo.upload = null;
    close();
  };

  const handleSave = async () => {
    const flattenedIds = rows
      .map((row) => [
        row.mon.map((course) => course.id),
        row.tue.map((course) => course.id),
        row.wed.map((course) => course.id),
        row.thu.map((course) => course.id),
        row.fri.map((course) => course.id),
        row.sat.map((course) => course.id),
      ])
      .flat(2)
      .filter((v) => v !== null && v !== "");
    const uniqueIds = [...new Set(flattenedIds)];
    const coursesWithDayPeriods = await enrollmentApi.update(uniqueIds);
    const periodDayCourseMap = transform(coursesWithDayPeriods);

    const newRows = Object.keys(periodDayCourseMap).map((period) => {
      return {
        name: `${period}限`,
        mon: periodDayCourseMap[Number(period)]["mon"],
        tue: periodDayCourseMap[Number(period)]["tue"],
        wed: periodDayCourseMap[Number(period)]["wed"],
        thu: periodDayCourseMap[Number(period)]["thu"],
        fri: periodDayCourseMap[Number(period)]["fri"],
        sat: periodDayCourseMap[Number(period)]["sat"],
      };
    });

    // TODO:
    console.log(newRows);

    setRows(newRows);
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>授業情報を編集</DialogTitle>
      <DialogContent>
        <DialogContentText>
          曜限を選択し、授業を登録してください。
        </DialogContentText>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {Object.keys(dayCodeToDayMap).map((dayCode) => (
                <TableCell align="center">
                  {dayCodeToDayMap[dayCode as Day]}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                {Object.keys(dayCodeToDayMap).map((dayCode) => (
                  <TableCell
                    align="center"
                    onClick={() =>
                      handleOpen(rowIndex, dayCode as Day, row[dayCode as Day])
                    }
                  >
                    {row[dayCode as Day].map((course) => (
                      <div>{course.name}</div>
                    ))}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isSelectCourseDialogOpen} onClose={handleClose}>
          <DialogTitle>
            {currentEdit
              ? `${currentEdit.columnName} ${currentEdit.rowIndex + 1}限の授業を選択`
              : "授業を選択"}
          </DialogTitle>
          <DialogContent>
            {/* <Typography>現在の授業</Typography>
            <Typography>{currentEdit?.courses.map((course) => course.name).join(",")}</Typography> */}
            {/* TODO: UI として複数授業の登録に対応する */}
            <FormControl fullWidth>
              {coursesOnCurrentDayPeriod.length === 0 ? (
                <DialogContentText>
                  この曜限の授業はありません。
                </DialogContentText>
              ) : (
                <>
                  <DialogContentText>
                    授業を選択してください。
                  </DialogContentText>
                  <InputLabel id="courses-by-day-period-label">授業</InputLabel>
                  <Select
                    labelId="courses-by-day-period-label"
                    id="courses-by-day-period"
                    value={currentEdit?.courses[0]} // TODO: 複数授業の登録に対応する
                    label="Age"
                    onChange={(e) => {
                      if (!currentEdit) return;
                      setCurrentEdit({
                        ...currentEdit,
                        courses: [
                          {
                            id: e.target.value as string,
                            name:
                              coursesOnCurrentDayPeriod.find(
                                (course) => course.id === e.target.value,
                              )?.name || "",
                          },
                        ], // TODO: 複数授業の登録に対応する
                      });
                    }}
                  >
                    {coursesOnCurrentDayPeriod.map((course) => (
                      <MenuItem value={course.id}>{course.name}</MenuItem>
                    ))}
                  </Select>
                </>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              キャンセル
            </Button>
            <Button
              onClick={() => {
                if (!currentEdit) return;
                const newRows = [...rows];
                newRows[currentEdit.rowIndex][currentEdit.columnName] =
                  currentEdit.courses;
                setRows(newRows);
                handleClose();
              }}
              color="primary"
            >
              保存
            </Button>
          </DialogActions>
        </Dialog>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          キャンセル
        </Button>
        <Button onClick={handleSave} color="primary">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserCourseDialog;
