import { DAY_TO_JAPANESE_MAP } from "common/consts";
import type { Course, Day } from "common/types";
import { useEffect, useState } from "react";
import courseApi from "~/api/course";
import CourseRegisterConfirmDialog from "./CourseRegisterConfirmDialog";

export default function SelectCourseDialog({
  open,
  onClose,
  currentEdit,
  handleCoursesUpdate,
}: {
  open: boolean;
  onClose: () => void;
  currentEdit: {
    rowIndex: number;
    columnName: Day;
    course: Course | null;
  } | null;
  handleCoursesUpdate: (courses: Course[]) => void;
}) {
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [filteredAvailableCourses, setFilteredAvailableCourses] = useState<
    Course[]
  >([]);
  const [newCourse, setNewCourse] = useState<Course | null>(null);
  const [confirmDialogStatus, setConfirmDialogStatus] = useState<
    "closed" | "add" | "delete"
  >("closed");

  useEffect(() => {
    (async () => {
      if (!currentEdit) return;
      const courses = await courseApi.getCoursesByDayAndPeriod(
        currentEdit.columnName,
        currentEdit.rowIndex + 1,
      );

      setAvailableCourses(courses);
      setFilteredAvailableCourses(courses);
    })();
  }, [currentEdit]);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      className={`modal ${open ? "modal-open" : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-box">
        <h2 className="font-bold text-lg">
          {currentEdit
            ? `${DAY_TO_JAPANESE_MAP.get(currentEdit.columnName)}曜${
                currentEdit.rowIndex + 1
              }限の授業を選択`
            : "授業を選択"}
        </h2>
        <div className="my-4">
          <div>
            <h3 className="font-semibold text-sm">現在の授業</h3>
            {currentEdit?.course ? (
              <div className="flex items-center justify-between rounded-lg border p-2">
                <div>
                  <p className="text-base">
                    {currentEdit?.course?.name ?? "-"}
                  </p>
                  <p className="text-gray-500 text-sm">{`${
                    currentEdit?.course?.teacher ?? "-"
                  } / ${currentEdit?.course?.id ?? "-"}`}</p>
                </div>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={async () => {
                    if (!currentEdit?.course?.id) return;
                    setNewCourse(currentEdit.course);
                    setConfirmDialogStatus("delete");
                  }}
                >
                  削除
                </button>
              </div>
            ) : (
              <p className="text-gray-500">未登録</p>
            )}
          </div>

          <input
            type="text"
            placeholder="授業名で検索"
            className="input input-bordered mt-4 w-full"
            onChange={(e) => {
              const newFilteredCourses = availableCourses.filter((course) =>
                course.name.includes(e.target.value.trim()),
              );
              setFilteredAvailableCourses(newFilteredCourses);
            }}
          />
          {filteredAvailableCourses.length === 0 ? (
            <p className="mt-2 text-gray-500">
              条件に当てはまる授業はありません。
            </p>
          ) : (
            <ul className="mt-4">
              {filteredAvailableCourses.map((course) => (
                // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                <li
                  key={course.id}
                  className="cursor-pointer rounded-lg border p-2 hover:bg-gray-100"
                  onClick={() => {
                    setNewCourse(course);
                    setConfirmDialogStatus("add");
                  }}
                >
                  <p>{course.name}</p>
                  <p className="text-gray-500 text-sm">{`${course.teacher} / ${course.id}`}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="modal-action">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            閉じる
          </button>
        </div>

        {newCourse && (
          <CourseRegisterConfirmDialog
            open={confirmDialogStatus !== "closed"}
            onClose={() => {
              setConfirmDialogStatus("closed");
              setNewCourse(null);
            }}
            courseToAddOrDelete={newCourse}
            mode={confirmDialogStatus === "delete" ? "delete" : "add"}
            handleSelectDialogClose={onClose}
            handleCoursesUpdate={handleCoursesUpdate}
          />
        )}
      </div>
    </div>
  );
}
