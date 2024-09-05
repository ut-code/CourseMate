import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import { Course, CourseDayPeriod, Day } from "../../common/types";
import courseApi from "../../api/course";
import SelectCourseDialog from "./SelectCourseDialog";

const dayCodeToDayMap: { [dayCode in Day]: string } = {
  mon: "月",
  tue: "火",
  wed: "水",
  thu: "木",
  fri: "金",
  sat: "土",
};

type DayToCourseByPeriodMap = {
  [day in Day]: Course | null;
};

const CoursesTable: React.FC = () => {
  const [isSelectCourseDialogOpen, setIsSelectCourseDialogOpen] =
    useState(false);
  const [currentEdit, setCurrentEdit] = useState<{
    rowIndex: number;
    columnName: Day;
    course: Course | null;
  } | null>(null);

  const [transposedRows, setTransposedRows] = useState<
    DayToCourseByPeriodMap[] | null
  >(null);

  const handleSelectCourseDialogOpen = async (
    rowIndex: number,
    columnName: Day,
    course: Course | null,
  ) => {
    setCurrentEdit({ rowIndex, columnName, course });
    setIsSelectCourseDialogOpen(true);
  };

  const handleCoursesUpdate = (
    courses: (Course & {
      courseDayPeriods: CourseDayPeriod[];
    })[],
  ) => {
    const newCourses: DayToCourseByPeriodMap[] = Array.from(
      { length: 6 },
      () => ({
        mon: null,
        tue: null,
        wed: null,
        thu: null,
        fri: null,
        sat: null,
      }),
    );
    courses.forEach((course) => {
      course.courseDayPeriods.forEach((dayPeriod) => {
        const { day, period } = dayPeriod;
        newCourses[period - 1][day] = course;
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
    <>
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
                      handleSelectCourseDialogOpen(
                        rowIndex,
                        dayCode as Day,
                        row[dayCode as Day] ?? null,
                      )
                    }
                  >
                    {row[dayCode as Day]?.name ?? "-"}
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
    </>
  );
};

export default CoursesTable;
