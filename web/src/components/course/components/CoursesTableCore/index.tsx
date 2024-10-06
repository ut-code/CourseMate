import { useCallback, useEffect, useState } from "react";
import { ACTIVE_DAYS, DAY_TO_JAPANESE_MAP } from "../../../../common/consts";
import type { Course, Day } from "../../../../common/types";
import { truncateStr } from "./lib";
import styles from "./styles.module.css";

type Props =
  | {
      courses: Course[];
      comparisonCourses?: Course[];
      isButton?: false | undefined;
      onCellClick?: never;
    }
  | {
      courses: Course[];
      comparisonCourses?: Course[];
      isButton: true;
      onCellClick: (rowIndex: number, day: Day, course: Course | null) => void;
    };

/**
 * NonEditableCoursesTable および EditableCoursesTable から呼び出して使用する。ページで直接呼び出さない。
 */
export default function CoursesTableCore(props: Props) {
  const [rows, setRows] = useState<
    {
      [day in Day]:
        | (Course & {
            isOverlapping?: boolean;
          })
        | null;
    }[]
  >(
    Array.from({ length: 6 }, () => ({
      mon: null,
      tue: null,
      wed: null,
      thu: null,
      fri: null,
      sat: null,
      sun: null,
      other: null,
    })),
  );

  const transformCoursesToRows = useCallback(
    (courses: Course[], comparisonCourses?: Course[]) => {
      const newRows: {
        [day in Day]: (Course & { isOverlapping?: boolean }) | null;
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
          newRows[period - 1][day] = course;
        }
        if (comparisonCourses) {
          for (const comparisonCourse of comparisonCourses) {
            if (course.id === comparisonCourse.id) {
              console.log("course.id", course.id);
              console.log("comparisonCourse.id", comparisonCourse.id);
              for (const slot of course.slots) {
                const { day, period } = slot;
                newRows[period - 1][day] = { ...course, isOverlapping: true };
              }
            }
          }
        }
      }
      console.log("newRows", newRows);
      return newRows;
    },
    [],
  );

  useEffect(() => {
    const newRows = transformCoursesToRows(
      props.courses,
      props.comparisonCourses,
    );
    setRows(newRows);
  }, [props.courses, props.comparisonCourses, transformCoursesToRows]);

  return (
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
        {rows.map((row, rowIndex) => (
          <tr key={`period-${rowIndex + 1}`}>
            <th key={`header-period-${rowIndex + 1}`}>{rowIndex + 1}</th>
            {ACTIVE_DAYS.map((day) => (
              <Cell
                key={`cell-${day}-${rowIndex.toString()}`}
                courseName={row[day]?.name ?? null}
                teacherName={row[day]?.teacher ?? null}
                isOverlapping={row[day]?.isOverlapping}
                isButton={props.isButton}
                onClick={
                  props.isButton
                    ? () => props.onCellClick(rowIndex, day, row[day] ?? null)
                    : undefined
                }
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Cell({
  courseName,
  teacherName,
  isButton = false,
  isOverlapping = false,
  onClick,
}: {
  courseName: string | null;
  teacherName: string | null;
  isButton?: boolean;
  isOverlapping?: boolean;
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
      {isButton ? (
        <button
          type="button"
          className={
            isOverlapping
              ? styles.overlapped
              : courseName
                ? styles.enrolled
                : ""
          }
          onClick={onClick}
        >
          {content}
        </button>
      ) : (
        <span
          className={
            isOverlapping
              ? styles.overlapped
              : courseName
                ? styles.enrolled
                : ""
          }
        >
          {content}
        </span>
      )}
    </td>
  );
}
