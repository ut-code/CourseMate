import { useCallback, useEffect, useState } from "react";

import courseApi from "../../../api/course";
import { ACTIVE_DAYS, DAY_TO_JAPANESE_MAP } from "../../../common/consts";
import type { Course, Day, UserID } from "../../../common/types";
import SelectCourseDialog from "../SelectCourseDialog";
import { truncateStr } from "./lib";
import styles from "./styles.module.css";

type Props = {
  userId: UserID;
  editable?: boolean;
};

export default function CoursesTable(props: Props) {
  const { userId, editable } = props;
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

  const handleCoursesUpdate = useCallback((courses: Course[]) => {
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
    for (const course of courses) {
      for (const slot of course.slots) {
        const { day, period } = slot;
        newCourses[period - 1][day] = course;
      }
    }
    setTransposedRows(newCourses);
  }, []);

  useEffect(() => {
    (async () => {
      const courses = await courseApi.getCoursesByUserId(userId);
      handleCoursesUpdate(courses);
    })();
  }, [userId, handleCoursesUpdate]);

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th />
            {ACTIVE_DAYS.map((activeDay) => (
              <th align="center" key={`header-${activeDay}`}>
                {DAY_TO_JAPANESE_MAP.get(activeDay as Day)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transposedRows?.map((row, rowIndex) => (
            <tr key={`period-${rowIndex + 1}`}>
              <th key={`header-period-${rowIndex + 1}`}>{rowIndex + 1}</th>
              {ACTIVE_DAYS.map((activeDay) => (
                <td
                  key={`cell-${activeDay}-${rowIndex.toString()}`}
                  align="center"
                >
                  {editable ? (
                    <button
                      type="button"
                      className={row[activeDay as Day]?.name && styles.enrolled}
                      onClick={() =>
                        handleSelectCourseDialogOpen(
                          rowIndex,
                          activeDay as Day,
                          row[activeDay as Day] ?? null,
                        )
                      }
                    >
                      {row[activeDay as Day]?.name &&
                      row[activeDay as Day]?.teacher
                        ? truncateStr(
                            `${row[activeDay as Day]?.name}(${row[activeDay as Day]?.teacher})`,
                            6,
                          )
                        : ""}
                    </button>
                  ) : (
                    <span
                      className={row[activeDay as Day]?.name && styles.enrolled}
                    >
                      {row[activeDay as Day]?.name &&
                      row[activeDay as Day]?.teacher
                        ? truncateStr(
                            `${row[activeDay as Day]?.name}(${
                              row[activeDay as Day]?.teacher
                            })`,
                            6,
                          )
                        : ""}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {editable && (
        <SelectCourseDialog
          open={isSelectCourseDialogOpen}
          onClose={() => setIsSelectCourseDialogOpen(false)}
          currentEdit={currentEdit}
          handleCoursesUpdate={handleCoursesUpdate}
        />
      )}
    </>
  );
}
