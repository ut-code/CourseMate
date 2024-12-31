import type { UserWithCoursesAndSubjects } from "common/types";
import UserAvatar from "~/components/human/avatar";

// TODO: CardFront との統合
export default function MockCardFront({
  displayedUser,
}: {
  displayedUser: Omit<
    UserWithCoursesAndSubjects,
    "courses" | "interestSubjects"
  >;
}) {
  return (
    <div
      className="flex h-full flex-col gap-5 overflow-clip border-2 border-primary bg-secondary p-5"
      style={{ width: "min(40dvh, 87.5vw)" }}
    >
      <div className="grid h-[20%] grid-cols-3 items-center">
        <UserAvatar
          pictureUrl={displayedUser.pictureUrl}
          width="9dvh"
          height="9dvh"
        />
        <div className="col-span-2 grid grid-rows-3 items-center">
          <p className="col-span-3 font-bold text-1xl">{displayedUser.name}</p>
          <p className="col-span-1 text-1xl">{displayedUser.grade}</p>
          <p className="col-span-2 text-1xl">{displayedUser.faculty}</p>
          <p className="col-span-2 text-1xl">{displayedUser.department}</p>
        </div>
      </div>

      <div className="flex h-[70%] w-full flex-col gap-2">
        <p className="col-span-2 text-1xl">{displayedUser.intro}</p>
      </div>

      {/* <div className="flex h-[70%] w-full flex-col gap-2" ref={containerRef}>
        <div
          ref={interestsContainerRef}
          className="width-full h-[50%] overflow-hidden"
        >
          <div />
          {isHiddenInterestExist && (
            <div className="badge badge-outline bg-gray-200 text-gray-700">
              And More
            </div>
          )}
        </div>

        <div
          ref={coursesContainerRef}
          className="width-full h-[50%] overflow-hidden"
        >
          <div />
          {isHiddenCourseExist && (
            <div className="badge badge-outline bg-gray-200 text-gray-700">
              And More
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
}
