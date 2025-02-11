import type { UserWithCoursesAndSubjects } from "common/types";
import UserAvatar from "./human/avatar";

export default function CardBasicInfo({
  displayedUser,
}: {
  displayedUser: Omit<
    UserWithCoursesAndSubjects,
    "courses" | "interestSubjects"
  >;
}) {
  return (
    <div className="flex h-18 items-center gap-6">
      <UserAvatar
        pictureUrl={displayedUser.pictureUrl}
        width="72px"
        height="72px"
      />
      <div className="flex h-full flex-col justify-center py-1">
        <p className="text-2xl">{displayedUser.name}</p>
        <p className="text-lg">{displayedUser.grade}</p>
        <p
          className={`text-${displayedUser.faculty.length + displayedUser.department.length > 10 ? "xs" : "md"}`}
        >{`${displayedUser.faculty} ${displayedUser.department}`}</p>
      </div>
    </div>
  );
}
