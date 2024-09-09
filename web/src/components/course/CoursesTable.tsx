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
import { ACTIVE_DAYS, DAY_TO_JAPANESE_MAP } from "../../common/consts";

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
            {ACTIVE_DAYS.map((activeDay) => (
              <TableCell align="center" key={`header-${activeDay}`}>
                {DAY_TO_JAPANESE_MAP.get(activeDay as Day)}
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
                {ACTIVE_DAYS.map((activeDay) => (
                  <TableCell
                    key={`cell-${activeDay}-${rowIndex}`}
                    align="center"
                    onClick={() =>
                      handleSelectCourseDialogOpen(
                        rowIndex,
                        activeDay as Day,
                        row[activeDay as Day] ?? null,
                      )
                    }
                  >
                    {row[activeDay as Day]?.name ?? "-"}
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
