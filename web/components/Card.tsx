import type { UserWithCoursesAndSubjects } from "common/types";
import React, { useRef, useEffect, useCallback } from "react";
import CardBasicInfo from "./CardBasicInfo";

interface CardProps {
  displayedUser: UserWithCoursesAndSubjects;
  currentUser: UserWithCoursesAndSubjects;
  setOpenDetailedMenu?: (value: boolean) => void;
  onFlip?: (isBack: boolean) => void;
}

export const CardFront = ({ displayedUser, currentUser }: CardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const interestsContainerRef = useRef<HTMLDivElement>(null);
  const coursesContainerRef = useRef<HTMLDivElement>(null);

  const calculateVisibleCourses = useCallback(() => {
    const courses = displayedUser.courses;
    const container = coursesContainerRef.current;
    if (!container) return;

    const containerHeight = container.offsetHeight;

    // 初期化
    container.innerHTML = "";

    const coursesContainer = document.createElement("div");
    coursesContainer.classList.add(
      "flex",
      "flex-wrap",
      "gap-1",
      "justify-start",
    );
    container.appendChild(coursesContainer);

    // `And More` 要素を作成して追加 (最初は非表示)
    const andMoreElement = document.createElement("p");
    andMoreElement.textContent = "And More";
    andMoreElement.classList.add(
      "text-sm",
      "text-gray-500",
      "text-center",
      "mt-2",
      "hidden", // 初期状態で非表示
    );
    andMoreElement.style.width = "100%";
    coursesContainer.appendChild(andMoreElement);

    // 一致しているコースと一致していないコースを分ける
    const matchingCourses = courses.filter((course) =>
      currentUser.courses.some((c) => c.id === course.id),
    );
    const nonMatchingCourses = courses.filter(
      (course) => !currentUser.courses.some((c) => c.id === course.id),
    );

    // バッジの生成
    const addedElements: HTMLElement[] = [];
    for (const course of [...matchingCourses, ...nonMatchingCourses]) {
      const isMatching = currentUser.courses.some((c) => c.id === course.id);

      const element = document.createElement("div");
      element.textContent = course.name;
      element.classList.add(
        "rounded-full",
        "text-center",
        "px-3",
        "py-1",
        "text-base",
        isMatching ? "bg-[#FFF1BF]" : "bg-base-200",
      );
      element.style.flexShrink = "0";

      coursesContainer.insertBefore(element, andMoreElement);
      addedElements.push(element);

      // バッジがはみ出す場合は削除
      if (
        coursesContainer.offsetHeight > containerHeight ||
        andMoreElement.offsetHeight + coursesContainer.offsetHeight >
          containerHeight
      ) {
        coursesContainer.removeChild(element);
        addedElements.pop();
        break;
      }
    }

    // すべてのバッジが表示されている場合は `And More` を非表示
    if (
      addedElements.length ===
      matchingCourses.length + nonMatchingCourses.length
    ) {
      andMoreElement.classList.add("hidden");
    } else {
      andMoreElement.classList.remove("hidden");
    }

    // ループ後、`And More` が完全に表示されるか確認
    while (
      coursesContainer.offsetHeight > containerHeight ||
      andMoreElement.offsetHeight + coursesContainer.offsetHeight >
        containerHeight
    ) {
      const lastElement = addedElements.pop();
      if (lastElement) {
        coursesContainer.removeChild(lastElement);
      } else {
        break; // バッジがなくなる場合は終了
      }
    }
  }, [displayedUser, currentUser]);

  const calculateVisibleInterests = useCallback(() => {
    const interests = displayedUser.interestSubjects;
    const container = interestsContainerRef.current;
    if (!container) return;

    const containerHeight = container.offsetHeight;

    // 初期化
    container.innerHTML = "";

    const flexContainer = document.createElement("div");
    flexContainer.classList.add("flex", "flex-wrap", "gap-1", "justify-start");
    container.appendChild(flexContainer);

    // `And More` 要素を作成して追加 (最初は非表示)
    const andMoreElement = document.createElement("p");
    andMoreElement.textContent = "And More";
    andMoreElement.classList.add(
      "text-sm",
      "text-gray-500",
      "text-center",
      "mt-2",
      "hidden", // 初期状態で非表示
    );
    andMoreElement.style.width = "100%";
    flexContainer.appendChild(andMoreElement);

    // 一致している興味分野と一致していない興味分野を分ける
    const matchingInterests = interests.filter((interest) =>
      currentUser.interestSubjects.some((i) => i.name === interest.name),
    );
    const nonMatchingInterests = interests.filter(
      (interest) =>
        !currentUser.interestSubjects.some((i) => i.name === interest.name),
    );

    // バッジの生成
    const addedElements: HTMLElement[] = [];
    for (const interest of [...matchingInterests, ...nonMatchingInterests]) {
      const isMatching = currentUser.interestSubjects.some(
        (i) => i.name === interest.name,
      );

      const element = document.createElement("div");
      element.textContent = `#${interest.name}`;
      element.classList.add(
        "rounded-md",
        "text-center",
        "px-3",
        "py-1",
        "text-primary",
        isMatching ? "bg-[#FFF1BF]" : "bg-[#F7FCFF]",
      );
      element.style.flexShrink = "0";

      flexContainer.insertBefore(element, andMoreElement);
      addedElements.push(element);

      // バッジがはみ出す場合は削除
      if (
        flexContainer.offsetHeight > containerHeight ||
        andMoreElement.offsetHeight + flexContainer.offsetHeight >
          containerHeight
      ) {
        flexContainer.removeChild(element);
        addedElements.pop();
        break;
      }
    }

    // すべてのバッジが表示されている場合は `And More` を非表示
    if (
      addedElements.length ===
      matchingInterests.length + nonMatchingInterests.length
    ) {
      andMoreElement.classList.add("hidden");
    } else {
      andMoreElement.classList.remove("hidden");
    }

    // ループ後、`And More` が完全に表示されるか確認
    while (
      flexContainer.offsetHeight > containerHeight ||
      andMoreElement.offsetHeight + flexContainer.offsetHeight > containerHeight
    ) {
      const lastElement = addedElements.pop();
      if (lastElement) {
        flexContainer.removeChild(lastElement);
      } else {
        break; // バッジがなくなる場合は終了
      }
    }
  }, [displayedUser, currentUser]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleInterests();
      calculateVisibleCourses();
    });

    resizeObserver.observe(container);

    calculateVisibleInterests();
    calculateVisibleCourses();

    return () => resizeObserver.disconnect();
  }, [calculateVisibleInterests, calculateVisibleCourses]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleInterests();
      calculateVisibleCourses();
    });

    resizeObserver.observe(container);

    // 初期計算を実行
    calculateVisibleInterests();
    calculateVisibleCourses();

    return () => resizeObserver.disconnect();
  }, [calculateVisibleInterests, calculateVisibleCourses]);

  return (
    <div className="flex h-full flex-col gap-5 overflow-clip rounded-md border-2 border-primary bg-secondary p-5">
      <CardBasicInfo displayedUser={displayedUser} />
      <div
        className="mt-2 flex h-[70%] w-full flex-col gap-2"
        ref={containerRef}
      >
        <p className="text-gray-500 text-sm">授業</p>
        <div
          ref={coursesContainerRef}
          className="h-[50%] w-full overflow-hidden"
        >
          <div />
        </div>
        <p className="text-gray-500 text-sm">興味分野</p>
        <div
          ref={interestsContainerRef}
          className="h-[50%] w-full overflow-hidden"
        >
          <div />
        </div>
      </div>
    </div>
  );
};

export function Card({
  displayedUser,
  currentUser,
  setOpenDetailedMenu,
}: CardProps) {
  return (
    <button
      type="button"
      className="perspective-[1000px] relative block appearance-none text-left"
      style={{ width: "min(50dvh, 87.5vw)", height: "70dvh" }}
      onClick={
        setOpenDetailedMenu ? () => setOpenDetailedMenu(true) : undefined
      }
    >
      <div
        id="card"
        className="transform-style-preserve-3d absolute top-0 left-0 h-full w-full transition-transform duration-600"
      >
        <CardFront displayedUser={displayedUser} currentUser={currentUser} />
      </div>
    </button>
  );
}
