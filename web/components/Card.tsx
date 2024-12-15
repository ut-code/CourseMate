import React, { useState, useRef, useEffect } from "react";
import ThreeSixtyIcon from "@mui/icons-material/ThreeSixty";
import type { User, UserID } from "common/types";
import { Chip } from "@mui/material";
import type { UserID, UserWithCoursesAndSubjects } from "common/types";
import { useState } from "react";
import NonEditableCoursesTable from "./course/NonEditableCoursesTable";
import UserAvatar from "./human/avatar";
import NonEditableCoursesTable from "./course/NonEditableCoursesTable";

interface CardProps {
  displayedUser: UserWithCoursesAndSubjects;
  comparisonUserId?: UserID;
  onFlip?: (isBack: boolean) => void;
}

const interests = [
  "記号論理学",
  "量子力学",
  "離散数学",
  "プログラミング",
  "量子情報理論",
  "オペレーションズリサーチ",
];

const CardFront = ({ displayedUser }: { displayedUser: User }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHiddenInterestExist, setHiddenInterestExist] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleInterests();
    });

    resizeObserver.observe(container);

    calculateVisibleInterests(); // 初期計算

    return () => resizeObserver.disconnect();
  }, []);

  const calculateVisibleInterests = () => {
    const container = containerRef.current;
    if (!container) return;

    const containerHeight = container.offsetHeight; // ここで高さを取得

    // 一旦全てのバッジを非表示にする
    container.innerHTML = "";
    setHiddenInterestExist(false);

    // interestsを入れるflexコンテナ
    const flexContainer = document.createElement("div");
    flexContainer.classList.add("flex", "flex-wrap", "gap-2");
    container.appendChild(flexContainer);

    // interests配列をループしてバッジを作成
    interests.forEach((interest) => {
      // 新しい div 要素を作成
      const element = document.createElement("div");
      element.textContent = interest;

      // スタイルを適用
      element.classList.add("badge", "badge-outline");
      element.style.overflow = "hidden";
      element.style.whiteSpace = "nowrap";
      element.style.textOverflow = "ellipsis";
      element.style.display = "inline-block";

      // 要素がコンテナの高さを超えていない場合、表示
      if (flexContainer.offsetHeight + 20 <= containerHeight) {
        flexContainer.appendChild(element);
      } else {
        setHiddenInterestExist(true);
      }
    });

  };

  return (
    <div className="flex h-full flex-col justify-between gap-5 overflow-clip border-2 border-primary bg-secondary p-5">
      <div className="grid h-[20%] grid-cols-3 items-center">
        <UserAvatar pictureUrl={displayedUser.pictureUrl} width="9dvh" height="9dvh" />
        <div className="grid grid-rows-3 items-center col-span-2">
          <p className="col-span-3 font-bold text-1xl">{displayedUser.name}</p>
          <p className="col-span-3 text-1xl">{displayedUser.grade}</p>
          <p className="col-span-1 text-1xl">{displayedUser.faculty}</p>
          <p className="col-span-2 text-1xl">{displayedUser.department}</p>
        </div>
      </div>

      <div ref={containerRef} className="h-[50%] overflow-hidden width-full">
        <div>
        </div>
      </div>

      {isHiddenInterestExist && (
        <div className="badge badge-outline bg-gray-200 text-gray-700">
          And More
        </div>
      )}

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
