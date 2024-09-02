import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import { Course, CourseDayPeriod, Day, UpdateUser } from "../../common/types";
import courseApi from "../../api/course";
import SelectCourseDialog from "./SelectCourseDialog";

type CoursesDialogProps = {
  isOpen: boolean;
  close: () => void;
  defaultValue: UpdateUser;
};

const dayCodeToDayMap: { [dayCode in Day]: string } = {
  mon: "月",
  tue: "火",
  wed: "水",
  thu: "木",
  fri: "金",
  sat: "土",
};

type DayToCoursesByPeriodMap = {
  [day in Day]: Course[];
};

const CoursesDialog: React.FC<CoursesDialogProps> = (
  props: CoursesDialogProps,
) => {
  const { isOpen, close } = props;
  const [isSelectCourseDialogOpen, setIsSelectCourseDialogOpen] =
    useState(false);
  const [currentEdit, setCurrentEdit] = useState<{
    rowIndex: number;
    columnName: Day;
  } | null>(null);

  const [transposedRows, setTransposedRows] = useState<
    DayToCoursesByPeriodMap[] | null
  >(null);

  const handleSelectCourseDialogOpen = async (
    rowIndex: number,
    columnName: Day,
  ) => {
    setCurrentEdit({ rowIndex, columnName });
    setIsSelectCourseDialogOpen(true);
  };

  const onClose = () => {
    close();
  };

  const handleCoursesUpdate = (
    courses: (Course & {
      courseDayPeriods: CourseDayPeriod[];
    })[],
  ) => {
    const newCourses: DayToCoursesByPeriodMap[] = Array.from(
      { length: 6 },
      () => ({
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [],
      }),
    );
    courses.forEach((course) => {
      course.courseDayPeriods.forEach((dayPeriod) => {
        const { day, period } = dayPeriod;
        newCourses[period - 1][day].push(course);
      });
    });
    setTransposedRows(newCourses);
  };

  useEffect(() => {
    (async () => {
      const courses = await courseApi.getMyCourses();
      handleCoursesUpdate(courses);
    })();
  }, []);

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
            {transposedRows &&
              transposedRows.map((row, rowIndex) => (
                <TableRow
                  key={`period ${rowIndex + 1}`}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {`${rowIndex + 1}限`}
                  </TableCell>
                  {Object.keys(dayCodeToDayMap).map((dayCode) => (
                    <TableCell
                      align="center"
                      onClick={() =>
                        handleSelectCourseDialogOpen(rowIndex, dayCode as Day)
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
        <SelectCourseDialog
          open={isSelectCourseDialogOpen}
          onClose={() => setIsSelectCourseDialogOpen(false)}
          currentEdit={currentEdit}
          handleCoursesUpdate={handleCoursesUpdate}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CoursesDialog;
