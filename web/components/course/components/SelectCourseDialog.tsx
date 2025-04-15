import { DAY_TO_JAPANESE_MAP } from "common/consts";
import type { Course, Day } from "common/types";
import { useEffect, useState } from "react";
import courseApi from "~/api/course";
import CourseRegisterConfirmDialog from "./CourseRegisterConfirmDialog";
import TagFilter from "./TagFilter";

const faculties = [
  "all",
  "zenki",
  "law",
  "medicine",
  "engineering",
  "arts",
  "science",
  "agriculture",
  "economics",
  "liberal-arts",
  "education",
  "pharmacy",
] as const;
export type FacultyKey = (typeof faculties)[number];
const facultyRegExMap = new Map<FacultyKey, RegExp>([
  ["all", /.*/],
  ["zenki", /^[34].*/],
  ["law", /^01.*/],
  ["medicine", /^02.*/],
  ["engineering", /^FEN.*/],
  ["arts", /^04.*/],
  ["science", /^05.*/],
  ["agriculture", /^06.*/],
  ["economics", /^07.*/],
  ["liberal-arts", /^08.*/],
  ["education", /^09.*/],
  ["pharmacy", /^10.*/],
]);

const facultyNameMap = new Map<FacultyKey, string>([
  ["all", "全て"],
  ["zenki", "前期教養"],
  ["law", "法"],
  ["medicine", "医"],
  ["engineering", "工"],
  ["arts", "文"],
  ["science", "理"],
  ["agriculture", "農"],
  ["economics", "経済"],
  ["liberal-arts", "後期教養"],
  ["education", "教育"],
  ["pharmacy", "薬"],
]);

// TODO: フィルタのロジックが異様にばらけているのでリファクタしよう・・
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
  const [searchText, setSearchText] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyKey>("all");
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
      <form className="modal-backdrop">
        <button
          type="button"
          onClick={() => {
            setSearchText("");
            setFilteredAvailableCourses(availableCourses);
            onClose();
          }}
        >
          閉じる
        </button>
      </form>

      <div className="modal-box">
        <h2 className="font-bold text-lg">
          {currentEdit
            ? `${DAY_TO_JAPANESE_MAP.get(currentEdit.columnName)}曜${
                currentEdit.rowIndex + 1
              }限の授業を選択`
            : "授業を選択"}
        </h2>
        <button
          type="button"
          className="btn btn-ghost btn-sm absolute top-3 right-3"
          onClick={() => {
            setSearchText("");
            setFilteredAvailableCourses(availableCourses);
            onClose();
          }}
        >
          閉じる
        </button>
        <div className="my-4">
          <div>
            <h3 className="font-semibold text-sm">現在の授業</h3>
            {currentEdit?.course ? (
              <div className="flex items-center justify-between rounded-lg border p-2">
                <div>
                  <p className="text-base">
                    {currentEdit?.course?.name ?? "-"}
                  </p>
                  <p className="text-gray-500 text-sm">{`${currentEdit?.course?.teacher ?? "-"} / ${
                    currentEdit?.course?.id ?? "-"
                  }`}</p>
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
            value={searchText}
            onChange={(e) => {
              const text = e.target.value.trim();
              setSearchText(text);
              const newFilteredCourses = availableCourses.filter((course) =>
                course.name.includes(text),
              );
              setFilteredAvailableCourses(newFilteredCourses);
            }}
          />
          <div className="my-4 flex flex-row">
            <TagFilter
              keyNameMap={facultyNameMap}
              selectedTag={selectedFaculty ?? "all"}
              onTagChange={(tag) => {
                setSelectedFaculty((prev) => (prev === tag ? "all" : tag));
              }}
            />
          </div>
          {filteredAvailableCourses.length === 0 ? (
            <p className="mt-2 text-gray-500">
              条件に当てはまる授業はありません。
            </p>
          ) : (
            <ul className="mt-4 max-h-[300px] overflow-auto">
              {filteredAvailableCourses
                .filter((course) =>
                  facultyRegExMap.get(selectedFaculty)?.test(course.id),
                )
                .map((course) => (
                  <li key={course.id}>
                    <button
                      type="button"
                      className="w-full cursor-pointer rounded-lg border p-2 hover:bg-gray-100"
                      onClick={() => {
                        setNewCourse(course);
                        setConfirmDialogStatus("add");
                      }}
                    >
                      <p>{course.name}</p>
                      <p className="text-gray-500 text-sm">{`${course.teacher} / ${course.id}`}</p>
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>

        {newCourse && (
          <CourseRegisterConfirmDialog
            open={confirmDialogStatus !== "closed"}
            onClose={() => {
              setConfirmDialogStatus("closed");
              setNewCourse(null);
              setSearchText("");
              setFilteredAvailableCourses(availableCourses);
              onClose();
            }}
            onCancel={() => {
              setConfirmDialogStatus("closed");
              setNewCourse(null);
            }}
            courseToAddOrDelete={newCourse}
            mode={confirmDialogStatus === "delete" ? "delete" : "add"}
            handleCoursesUpdate={handleCoursesUpdate}
          />
        )}
      </div>
    </div>
  );
}
