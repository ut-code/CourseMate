import { DAY_TO_JAPANESE_MAP, sortSlots } from "common/consts";
import type { UserWithCoursesAndSubjects } from "common/types";
import { MdClose } from "react-icons/md";

type Props = {
  onClose: () => void;
  displayedUser: UserWithCoursesAndSubjects;
};

export default function PersonDetailedMenu({ onClose, displayedUser }: Props) {
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
              <h3 className="text-lg">{displayedUser.name}の詳細情報</h3>
              <span />
            </div>
          </form>
        </div>
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
            <span className="text-gray-500 text-xs">講義</span>
            {displayedUser.courses.map(
              (course) =>
                course.name && (
                  <p key={course.id} className="text-lg">
                    {sortSlots(course.slots)
                      .map(
                        (slot) =>
                          `${DAY_TO_JAPANESE_MAP.get(slot.day)}${slot.period}`,
                      )
                      .join("・")}
                    /{course.name} ({course.teacher}) {course.id}
                  </p>
                ),
            )}
          </div>
          <div className="divider m-0" />
          <div>
            <span className="text-gray-500 text-xs">興味分野</span>
            {displayedUser.interestSubjects.map(
              (subject) =>
                subject.name && (
                  <p key={subject.id} className="text-lg">
                    {subject.name}
                  </p>
                ),
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
