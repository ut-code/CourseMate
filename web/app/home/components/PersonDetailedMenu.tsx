import { DAY_TO_JAPANESE_MAP, sortSlots } from "common/consts";
import type { UserWithCoursesAndSubjects } from "common/types";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import { MdOpenInNew } from "react-icons/md";
import { MdArrowBack } from "react-icons/md";

type Props = {
  onClose: () => void;
  displayedUser: UserWithCoursesAndSubjects;
};

export default function PersonDetailedMenu({ onClose, displayedUser }: Props) {
  const [menuStatus, setMenuStatus] = useState<"detailedInfo" | "coursesTable">(
    "detailedInfo",
  );

  return (
    <dialog
      id="dialog"
      className="modal modal-open modal-bottom sm:modal-middle p-0"
    >
      <div className="modal-box p-0">
        <div className="sticky top-0 bg-white p-2">
          <form method="dialog">
            <div className="relative flex items-center justify-center">
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost absolute top-0 left-0"
                onClick={onClose}
              >
                <MdClose className="text-2xl" />
              </button>
              <h3 className="text-lg">
                {displayedUser.name}の
                {menuStatus === "detailedInfo" ? "詳細情報" : "時間割表"}
              </h3>
              <span />
            </div>
          </form>
        </div>
        {menuStatus === "detailedInfo" ? (
          <div className="p-4">
            <div>
              <span className="text-gray-500 text-xs">名前</span>
              <p className="text-lg">{displayedUser.name}</p>
            </div>
            <div className="divider m-0" />
            <div>
              <span className="text-gray-500 text-xs">年齢・性別</span>
              <p className="text-lg">{displayedUser.gender}</p>
            </div>
            <div className="divider m-0" />
            <div>
              <span className="text-gray-500 text-xs">自己紹介</span>
              <p className="text-md">{displayedUser.intro}</p>
            </div>
            <div className="divider m-0" />
            <div>
              <div className="mt-0.5 mb-1 flex items-center justify-between">
                <span className="text-gray-500 text-xs">講義</span>
                <button
                  type="button"
                  className="btn btn-xs font-normal text-primary"
                  onClick={() => setMenuStatus("coursesTable")}
                >
                  <MdOpenInNew className="mr-[-4px]" />
                  時間割表を確認
                </button>
              </div>
              {displayedUser.courses.map(
                (course) =>
                  course.name && (
                    <div
                      key={course.id}
                      className="flex rounded-md bg-[#F7FCFF] px-2 text-lg"
                    >
                      <span className="w-[12vh]">
                        {sortSlots(course.slots)
                          .map(
                            (slot) =>
                              `${DAY_TO_JAPANESE_MAP.get(slot.day)}${slot.period}`,
                          )
                          .join("・")}
                      </span>
                      <span className="flex-1">
                        {course.name} ({course.teacher}){" "}
                      </span>
                      <span>{course.id}</span>
                    </div>
                  ),
              )}
            </div>
            <div className="divider m-0" />
            <div>
              <span className="text-gray-500 text-xs">興味分野</span>
              <div className="flex flex-wrap gap-2">
                {displayedUser.interestSubjects.map(
                  (subject) =>
                    subject.name && (
                      <span
                        key={subject.id}
                        className="rounded-md bg-[#FFF1BF] px-2 py-0.5 text-lg text-primary"
                      >
                        #{subject.name}
                      </span>
                    ),
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p>
              courses table
              {/* TODO: */}
            </p>
            <button
              type="button"
              className="btn btn-xs font-normal text-primary"
              onClick={() => setMenuStatus("detailedInfo")}
            >
              <MdArrowBack className="mr-[-4px]" />
              詳細情報に戻る
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
