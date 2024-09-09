import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import { Course, Day } from "../../common/types";
import courseApi from "../../api/course";
import SelectCourseDialog from "./SelectCourseDialog";
import { dayCodeToDayMap } from "../../common/consts";

export default function CoursesTable() {
  const [isSelectCourseDialogOpen, setIsSelectCourseDialogOpen] =
    useState(false);
  const [currentEdit, setCurrentEdit] = useState<{
    rowIndex: number;
    columnName: Day;
    course: Course | null;
  } | null>(null);

  const [transposedRows, setTransposedRows] = useState<
    | {
        [day in Day]: Course | null;
      }[]
    | null
  >(null);

  async function handleSelectCourseDialogOpen(
    rowIndex: number,
    columnName: Day,
    course: Course | null,
  ) {
    setCurrentEdit({ rowIndex, columnName, course });
    setIsSelectCourseDialogOpen(true);
  }

  function handleCoursesUpdate(courses: Course[]) {
    const newCourses: {
      [day in Day]: Course | null;
    }[] = Array.from({ length: 6 }, () => ({
      mon: null,
      tue: null,
      wed: null,
      thu: null,
      fri: null,
      sat: null,
      sun: null,
    }));
    courses.forEach((course) => {
      course.slots.forEach((slot) => {
        const { day, period } = slot;
        newCourses[period - 1][day] = course;
      });
    });
    setTransposedRows(newCourses);
  }

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
            {Array.from(dayCodeToDayMap.keys()).map((dayCode) => (
              <TableCell align="center" key={`header-${dayCode}`}>
                {dayCodeToDayMap.get(dayCode as Day)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {transposedRows &&
            transposedRows.map((row, rowIndex) => (
              <TableRow
                key={`period-${rowIndex + 1}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  key={`header-period-${rowIndex + 1}`}
                >
                  {`${rowIndex + 1}限`}
                </TableCell>
                {Array.from(dayCodeToDayMap.keys()).map((dayCode) => (
                  <TableCell
                    key={`cell-${dayCode}-${rowIndex}`}
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
}
