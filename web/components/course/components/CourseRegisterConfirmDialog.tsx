import type { Course } from "common/types";
import { useEffect, useState } from "react";
import { addMyCourse, getMyCoursesOverlapWith } from "~/api/course";

export default function CourseRegisterConfirmDialog({
  open,
  onClose,
  course,
  handleSelectDialogClose,
  handleCoursesUpdate,
}: {
  open: boolean;
  onClose: () => void;
  course: Course | null;
  handleSelectDialogClose: () => void;
  handleCoursesUpdate: (courses: Course[]) => void;
}) {
  const [overlapCourses, setOverlapCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!course) return;

    setIsLoading(true);
    setOverlapCourses([]);

    (async () => {
      const courses = await getMyCoursesOverlapWith(course.id);
      setOverlapCourses(courses);
      setIsLoading(false);
    })();
  }, [course]);

  return (
    <div className={`modal ${open ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">変更の確認</h3>
        <p className="py-4">次のように変更します。よろしいですか？</p>
        <div className="mt-2 space-y-2">
          {course && (
            <div className="alert alert-success">
              {`追加: ${course.name} (${course.teacher})`}
            </div>
          )}
          {isLoading ? (
            <div className="alert alert-info">読み込み中...</div>
          ) : (
            <div className="alert alert-error">
              {`削除: ${
                overlapCourses
                  .map(
                    (overlapCourse) =>
                      `${overlapCourse.name} (${overlapCourse.teacher})`,
                  )
                  .join("・") || "なし"
              }`}
            </div>
          )}
        </div>
        <div className="modal-action">
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button className="btn btn-ghost" onClick={onClose}>
            キャンセル
          </button>
          {course && (
            // biome-ignore lint/a11y/useButtonType: <explanation>
            <button
              className="btn btn-primary"
              onClick={async () => {
                const newCourses = await addMyCourse(course.id);
                handleCoursesUpdate(newCourses);
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
