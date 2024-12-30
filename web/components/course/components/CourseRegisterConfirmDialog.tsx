import type { Course } from "common/types";
import { useEffect, useState } from "react";
import { MdAddCircleOutline } from "react-icons/md";
import { MdRemoveCircleOutline } from "react-icons/md";
import {
  addMyCourse,
  deleteMyCourse,
  getMyCoursesOverlapWith,
} from "~/api/course";

export default function CourseRegisterConfirmDialog({
  open,
  onClose,
  mode,
  courseToAddOrDelete,
  handleSelectDialogClose,
  handleCoursesUpdate,
}: {
  open: boolean;
  onClose: () => void;
  mode: "add" | "delete";
  courseToAddOrDelete: Course;
  handleSelectDialogClose: () => void;
  handleCoursesUpdate: (courses: Course[]) => void;
}) {
  const [overlapCourses, setOverlapCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!courseToAddOrDelete) return;
    setIsLoading(true);
    setOverlapCourses([]);
    (async () => {
      const courses = await getMyCoursesOverlapWith(courseToAddOrDelete.id);
      setOverlapCourses(courses);
      setIsLoading(false);
    })();
  }, [courseToAddOrDelete]);

  const coursesToBeDeletedString = overlapCourses
    .map((overlapCourse) => `${overlapCourse.name} (${overlapCourse.teacher})`)
    .join("・");

  return (
    <div className={`modal ${open ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          {mode === "add" ? "変更" : "削除"}の確認
        </h3>
        <p className="py-4">
          {mode === "add" ? "次のように変更" : "次の授業を削除"}
          します。よろしいですか？
        </p>
        <div className="mt-2 space-y-2">
          {courseToAddOrDelete && mode === "add" ? (
            <div className="bg-green-100 px-4 py-2">
              <div className="flex items-center text-gray-500">
                <MdAddCircleOutline />
                <span>追加</span>
              </div>
              <p className="text-md">{`${courseToAddOrDelete.name} (${courseToAddOrDelete.teacher})`}</p>
            </div>
          ) : (
            <div className="bg-red-100 px-4 py-2">
              <div className="flex items-center text-gray-500">
                <MdRemoveCircleOutline />
                <span>削除</span>
              </div>
              <p className="text-md">{`${courseToAddOrDelete.name} (${courseToAddOrDelete.teacher})`}</p>
            </div>
          )}
          {isLoading ? (
            <div className="alert alert-info">読み込み中...</div>
          ) : (
            mode === "add" &&
            coursesToBeDeletedString && (
              <div className="bg-red-100 px-4 py-2">
                <div className="flex items-center text-gray-500">
                  <MdRemoveCircleOutline />
                  <span>削除</span>
                </div>
                <p className="text-md">{coursesToBeDeletedString}</p>
              </div>
            )
          )}
        </div>
        <div className="modal-action">
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button className="btn btn-ghost" onClick={onClose}>
            キャンセル
          </button>
          {courseToAddOrDelete && (
            // biome-ignore lint/a11y/useButtonType: <explanation>
            <button
              className="btn btn-primary"
              onClick={async () => {
                if (mode === "add") {
                  const newCourses = await addMyCourse(courseToAddOrDelete.id);
                  handleCoursesUpdate(newCourses);
                } else {
                  const newCourses = await deleteMyCourse(
                    courseToAddOrDelete.id,
                  );
                  handleCoursesUpdate(newCourses);
                }
                onClose();
                handleSelectDialogClose();
              }}
            >
              確定
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
