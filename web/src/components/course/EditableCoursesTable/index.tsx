import { useCallback, useEffect, useState } from "react";

import courseApi from "../../../api/course";
import { ACTIVE_DAYS, DAY_TO_JAPANESE_MAP } from "../../../common/consts";
import type { Course, Day, UserID } from "../../../common/types";
import FullScreenCircularProgress from "../../common/FullScreenCircularProgress";
import SelectCourseDialog from "../SelectCourseDialog";
import { truncateStr } from "./lib";
import styles from "./styles.module.css";

type Props = {
  userId: UserID;
  editable?: boolean;
};

export default function EditableCoursesTable(props: Props) {
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
      other: null,
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

  return !transposedRows ? (
    <FullScreenCircularProgress />
  ) : (
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
          {transposedRows.map((row, rowIndex) => (
            <tr key={`period-${rowIndex + 1}`}>
              <th key={`header-period-${rowIndex + 1}`}>{rowIndex + 1}</th>
              {ACTIVE_DAYS.map((day) => (
                <Cell
                  key={`cell-${day}-${rowIndex.toString()}`}
                  day={day}
                  rowIndex={rowIndex}
                  courseName={row[day]?.name ?? null}
                  teacherName={row[day]?.teacher ?? null}
                  editable={editable}
                  onClick={() =>
                    handleSelectCourseDialogOpen(
                      rowIndex,
                      day,
                      row[day] ?? null,
                    )
                  }
                />
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

function Cell({
  courseName,
  teacherName,
  editable = false,
  onClick,
}: {
  day: (typeof ACTIVE_DAYS)[number];
  rowIndex: number;
  courseName: string | null;
  teacherName: string | null;
  editable?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span>{courseName ? truncateStr(courseName ?? "", 16) : ""}</span>
      <span>{teacherName ? truncateStr(teacherName ?? "", 6) : ""}</span>
    </>
  );

  return (
    <td align="center">
      {editable ? (
        <button
          type="button"
          className={courseName ? styles.enrolled : ""}
          onClick={onClick}
        >
          {content}
        </button>
      ) : (
        <span className={courseName ? styles.enrolled : ""}>{content}</span>
      )}
    </td>
  );
}
