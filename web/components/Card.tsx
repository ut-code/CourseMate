import ThreeSixtyIcon from "@mui/icons-material/ThreeSixty";
import type { UserWithCoursesAndSubjects } from "common/types";
import React, { useState, useRef, useEffect, useCallback } from "react";
import NonEditableCoursesTable from "./course/NonEditableCoursesTable";
import UserAvatar from "./human/avatar";

interface CardProps {
  displayedUser: UserWithCoursesAndSubjects;
  currentUser: UserWithCoursesAndSubjects;
  onFlip?: (isBack: boolean) => void;
}

const CardFront = ({ displayedUser, currentUser }: CardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const interestsContainerRef = useRef<HTMLDivElement>(null);
  const coursesContainerRef = useRef<HTMLDivElement>(null);
  const [isHiddenInterestExist, setHiddenInterestExist] = useState(false);
  const [isHiddenCourseExist, setHiddenCourseExist] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleInterests();
      calculateVisibleCourses();
    });

    resizeObserver.observe(container);

    calculateVisibleInterests(); // 初期計算
    calculateVisibleCourses(); // 初期計算

    return () => resizeObserver.disconnect();
  }, []);

  const calculateVisibleCourses = useCallback(() => {
    const courses = displayedUser.courses;
    const container = coursesContainerRef.current;
    if (!container) return;

    const containerHeight = container.offsetHeight; // コンテナの高さを取得

    // 一旦コンテナを初期化
    container.innerHTML = "";
    setHiddenCourseExist(false);

    // courses を一致・非一致で分類
    const matchingCourses = courses.filter((course) =>
      currentUser.courses.some((c) => c.id === course.id),
    );
    const nonMatchingCourses = courses.filter(
      (course) => !currentUser.courses.some((c) => c.id === course.id),
    );

    // courses を表示する flex コンテナ
    const coursesContainer = document.createElement("div");
    coursesContainer.classList.add("flex", "flex-wrap", "gap-2");
    container.appendChild(coursesContainer);

    // 一致しているコースを先に表示
    for (const course of [...matchingCourses, ...nonMatchingCourses]) {
      const isMatching = currentUser.courses.some((c) => c.id === course.id);

      // 新しい div 要素を作成
      const element = document.createElement("div");
      element.textContent = course.name;

      // スタイル適用（赤 or 灰色）
      element.classList.add("badge", "badge-outline");
      element.style.backgroundColor = isMatching ? "red" : "gray";
      element.style.color = "white";

      // 表示判定
      if (coursesContainer.offsetHeight + 30 <= containerHeight) {
        coursesContainer.appendChild(element);
      } else {
        setHiddenCourseExist;
      }
    }
  }, [displayedUser, currentUser]);

  const calculateVisibleInterests = useCallback(() => {
    const interests = displayedUser.interestSubjects;
    const container = interestsContainerRef.current;
    if (!container) return;

    const containerHeight = container.offsetHeight; // コンテナの高さを取得

    // 一旦コンテナを初期化
    container.innerHTML = "";
    setHiddenInterestExist(false);

    // interests を一致・非一致で分類
    const matchingInterests = interests.filter((interest) =>
      currentUser.interestSubjects.some((i) => i.name === interest.name),
    );
    const nonMatchingInterests = interests.filter(
      (interest) =>
        !currentUser.interestSubjects.some((i) => i.name === interest.name),
    );

    // interests を表示する flex コンテナ
    const flexContainer = document.createElement("div");
    flexContainer.classList.add("flex", "flex-wrap", "gap-2");
    container.appendChild(flexContainer);

    // 一致している興味分野を先に表示
    for (const interest of [...matchingInterests, ...nonMatchingInterests]) {
      const isMatching = currentUser.interestSubjects.some(
        (i) => i.name === interest.name,
      );

      // 新しい div 要素を作成
      const element = document.createElement("div");
      element.textContent = interest.name;

      // スタイル適用（赤 or 灰色）
      element.classList.add("badge", "badge-outline");
      element.style.backgroundColor = isMatching ? "red" : "gray";
      element.style.color = "white";
      element.style.overflow = "hidden";
      element.style.whiteSpace = "nowrap";
      element.style.textOverflow = "ellipsis";

      // 表示判定
      if (flexContainer.offsetHeight + 30 <= containerHeight) {
        flexContainer.appendChild(element);
      } else {
        setHiddenInterestExist(true);
      }
    }
  }, [displayedUser, currentUser]);

  return (
    <div className="flex h-full flex-col gap-5 overflow-clip border-2 border-primary bg-secondary p-5">
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

      <div className="flex h-[70%] w-full flex-col gap-2" ref={containerRef}>
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
      </div>
    </div>
  );
};

const CardBack = ({ displayedUser, currentUser }: CardProps) => {
  return (
    <div className="flex h-full flex-col overflow-hidden border-2 border-primary bg-secondary p-4">
      <div className="flex justify-center">
        <p className="font-bold text-lg">{displayedUser?.name}</p>
      </div>
      <NonEditableCoursesTable
        userId={displayedUser.id}
        comparisonUserId={currentUser.id}
      />
      <div className="mt-4 flex justify-center">
        <ThreeSixtyIcon className="text-3xl" />
      </div>
    </div>
  );
};

export function Card({ displayedUser, currentUser, onFlip }: CardProps) {
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
          <CardFront displayedUser={displayedUser} currentUser={currentUser} />
        </div>
        <div
          className="absolute h-full w-full"
          style={{
            backfaceVisibility: "hidden",
            transform: isDisplayingBack ? "rotateY(0deg)" : "rotateY(-180deg)",
          }}
        >
          <CardBack displayedUser={displayedUser} currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}
