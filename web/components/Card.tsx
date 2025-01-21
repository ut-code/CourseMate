import type { UserWithCoursesAndSubjects } from "common/types";
import React, { useRef, useEffect, useCallback } from "react";
import UserAvatar from "./human/avatar";

interface CardProps {
  displayedUser: UserWithCoursesAndSubjects;
  currentUser: UserWithCoursesAndSubjects;
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
      "gap-3",
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
        "px-4",
        "py-2",
        "text-base",
        isMatching ? "font-bold" : "font-normal",
      );
      element.style.backgroundColor = "gray";
      element.style.color = "white";
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
    flexContainer.classList.add("flex", "flex-wrap", "gap-3", "justify-start");
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
      element.textContent = interest.name;

      element.classList.add(
        "rounded-full",
        "text-center",
        "px-4",
        "py-2",
        "text-base",
        isMatching ? "font-bold" : "font-normal",
      );
      element.style.backgroundColor = "#FFF1BF";
      element.style.color = "#039BE5";
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

      <p className="text-center font-bold text-lg">履修している科目</p>
      <div className="flex h-[70%] w-full flex-col gap-2" ref={containerRef}>
        <div
          ref={coursesContainerRef}
          className="width-full h-[50%] overflow-hidden"
        >
          <div />
        </div>

        <p className="text-center font-bold text-lg">興味のある分野</p>
        <div
          ref={interestsContainerRef}
          className="width-full h-[50%] overflow-hidden"
        >
          <div />
        </div>
      </div>
    </div>
  );
};

export function Card({ displayedUser, currentUser }: CardProps) {
  return (
    <div
      className="perspective-[1000px] relative cursor-pointer"
      style={{ width: "min(40dvh, 87.5vw)", height: "70dvh" }}
    >
      <div
        id="card"
        className="transform-style-preserve-3d absolute h-full w-full transition-transform duration-600"
      >
        <div className="absolute h-full w-full">
          <CardFront displayedUser={displayedUser} currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}
