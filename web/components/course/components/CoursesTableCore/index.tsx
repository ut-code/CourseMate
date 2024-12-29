import { ACTIVE_DAYS, DAY_TO_JAPANESE_MAP } from "common/consts";
import type { Course, Day } from "common/types";
import { useCallback, useEffect, useState } from "react";
import { truncateStr } from "./lib";

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
              for (const slot of course.slots) {
                const { day, period } = slot;
                newRows[period - 1][day] = { ...course, isOverlapping: true };
              }
            }
          }
        }
      }
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
    <div className="flex h-full flex-col">
      <div
        className="grid h-[3vh] grid-rows-1 gap-1"
        style={{
          gridTemplateColumns: `3vh repeat(${ACTIVE_DAYS.length}, minmax(0, 1fr))`,
        }}
      >
        <span className="rounded-sm bg-gray-100" />
        {ACTIVE_DAYS.map((activeDay) => (
          <span
            key={`header-${activeDay}`}
            className="inline-flex items-center justify-center rounded-sm bg-gray-100 text-center text-xs"
          >
            {DAY_TO_JAPANESE_MAP.get(activeDay as Day)}
          </span>
        ))}
      </div>
      <div className="mt-1 flex flex-1 gap-1">
        <div className="flex h-full w-[3vh] flex-col gap-1">
          {Array.from({ length: 6 }, (_, i) => (
            <span
              key={`period-${i + 1}`}
              className="inline-flex flex-1 items-center justify-center rounded-sm bg-gray-100 text-xs"
            >
              {i + 1}
            </span>
          ))}
        </div>
        <div
          className="grid flex-1 grid-rows-6 gap-1"
          style={{
            gridTemplateColumns: `repeat(${ACTIVE_DAYS.length}, minmax(0, 1fr))`,
          }}
        >
          {/* TODO: grid-auto-flow: column; で縦方向に流すほうが余計な変形ロジックが減りそう */}
          {rows.map((row, rowIndex) =>
            ACTIVE_DAYS.map((day) => (
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
            )),
          )}
        </div>
      </div>
    </div>
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
      <span
        style={{
          margin: 0,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          lineClamp: 2,
          textOverflow: "ellipsis",
        }}
      >
        {courseName ? truncateStr(courseName ?? "", 16) : ""}
      </span>
      <span
        style={{
          margin: 0,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 1,
          lineClamp: 1,
          textOverflow: "ellipsis",
        }}
      >
        {teacherName ? truncateStr(teacherName ?? "", 6) : ""}
      </span>
    </>
  );

  return (
    <span
      className={`inline-flex flex-1 items-center justify-center rounded-sm p-0.5 text-xs ${
        !courseName
          ? "bg-transparent"
          : isOverlapping
            ? "bg-[#FFF1BF]"
            : "bg-[#F7FCFF]"
      }`}
    >
      {isButton ? (
        <button type="button" onClick={onClick}>
          {content}
        </button>
      ) : (
        <span className="inline-flex flex-col justify-between">{content}</span>
      )}
    </span>
  );
}
