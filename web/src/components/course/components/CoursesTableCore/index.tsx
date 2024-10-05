import { ACTIVE_DAYS, DAY_TO_JAPANESE_MAP } from "../../../../common/consts";
import type { Course, Day } from "../../../../common/types";
import { truncateStr } from "./lib";
import styles from "./styles.module.css";

type Props = {
  rows: {
    [day in Day]: Course | null;
  }[];
  isButton?: boolean;
  onCellClick: (rowIndex: number, day: Day, course: Course | null) => void;
};

/**
 * NonEditableCoursesTable および EditableCoursesTable から呼び出して使用する。ページで直接呼び出さない。
 */
export default function CoursesTableCore(props: Props) {
  const { rows, isButton = false, onCellClick } = props;
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
                day={day}
                rowIndex={rowIndex}
                courseName={row[day]?.name ?? null}
                teacherName={row[day]?.teacher ?? null}
                editable={isButton}
                onClick={() => onCellClick(rowIndex, day, row[day] ?? null)}
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
