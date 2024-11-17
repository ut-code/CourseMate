import ThreeSixtyIcon from "@mui/icons-material/ThreeSixty";
import { Chip } from "@mui/material";
import { useState } from "react";
import type { User, UserID } from "~/common/types";
import NonEditableCoursesTable from "./course/NonEditableCoursesTable";
import UserAvatar from "./human/avatar";

interface CardProps {
  displayedUser: User;
  comparisonUserId?: UserID;
  onFlip?: (isBack: boolean) => void;
}

export function Card({ displayedUser, comparisonUserId, onFlip }: CardProps) {
  const [isDisplayingBack, setIsDisplayingBack] = useState(false);

  const handleRotate = () => {
    setIsDisplayingBack(!isDisplayingBack);
    if (onFlip) onFlip(!isDisplayingBack);
  };

  return (
    <div
      className="perspective-[1000px] relative cursor-pointer"
      style={{ width: "min(40dvh, 87.5vw)", height: "70dvh" }}
      onClick={handleRotate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") handleRotate();
      }}
    >
      <div
        id="card"
        className="transform-style-preserve-3d absolute h-full w-full transition-transform duration-600"
      >
        <div
          className="absolute h-full w-full"
          style={{
            backfaceVisibility: "hidden",
            transform: isDisplayingBack ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <CardFront displayedUser={displayedUser} />
        </div>
        <div
          className="absolute h-full w-full"
          style={{
            backfaceVisibility: "hidden",
            transform: isDisplayingBack ? "rotateY(0deg)" : "rotateY(-180deg)",
          }}
        >
          <CardBack
            displayedUser={displayedUser}
            comparisonUserId={comparisonUserId}
          />
        </div>
      </div>
    </div>
  );
}

const CardFront = ({ displayedUser }: CardProps) => {
  return (
    <div className="flex h-full flex-col justify-between gap-5 overflow-hidden border-2 border-primary bg-secondary p-5">
      <div className="grid h-[30%] grid-cols-3 items-center">
        <UserAvatar
          pictureUrl={displayedUser.pictureUrl}
          width="10dvh"
          height="10dvh"
        />
        <div className="col-span-2 ml-2 flex justify-center">
          <span className="font-bold text-4xl">{displayedUser.name}</span>
        </div>
      </div>
      <div className="grid grid-cols-6 items-center gap-4">
        <Chip label="学部" size="small" className="col-span-1" />
        <p className="col-span-5 text-xl">{displayedUser.faculty}</p>
      </div>
      <div className="grid grid-cols-6 items-center gap-4">
        <Chip label="学科" size="small" className="col-span-1" />
        <p
          className={`col-span-5 text-xl ${displayedUser.department.length > 7 ? "text-xs" : "text-2xl"}`}
        >
          {displayedUser.department}
        </p>
      </div>
      <div className="grid grid-cols-6 items-center gap-4">
        <Chip label="性別" size="small" className="col-span-1" />
        <p className="col-span-5 text-xl">{displayedUser.gender}</p>
      </div>
      <div className="grid grid-cols-6 items-center gap-4">
        <Chip label="学年" size="small" className="col-span-1" />
        <p className="col-span-5 text-xl">{displayedUser.grade}</p>
      </div>
      <div className="grid max-h-[32%] flex-1 grid-cols-6 gap-4">
        <Chip label="自己紹介" size="small" className="col-span-1 text-sm" />
        <p className="col-span-5 line-clamp-8 overflow-hidden text-sm">
          {displayedUser.intro}
        </p>
      </div>
      <div className="flex justify-center">
        <ThreeSixtyIcon className="text-3xl" />
      </div>
    </div>
  );
};

const CardBack = ({ displayedUser, comparisonUserId }: CardProps) => {
  return (
    <div className="flex h-full flex-col overflow-hidden border-2 border-primary bg-secondary p-4">
      <div className="flex justify-center">
        <p className="font-bold text-lg">{displayedUser?.name}</p>
      </div>
      <NonEditableCoursesTable
        userId={displayedUser.id}
        comparisonUserId={comparisonUserId}
      />
      <div className="mt-4 flex justify-center">
        <ThreeSixtyIcon className="text-3xl" />
      </div>
    </div>
  );
};
