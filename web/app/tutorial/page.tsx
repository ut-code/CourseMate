"use client";

import Link from "next/link";

const tutorialSteps = [
  {
    label: "CourseMateの使い方",
    imgPath: "/course-mate-icon.svg",
  },
  {
    label: "気になる人に「いいね」を送ろう！",
    imgPath: "/tutorial-1.png",
  },
  {
    label: "リクエストが来たら...",
    imgPath: "/tutorial-2.png",
  },
  {
    label: "承認して、マッチング！",
    imgPath: "/tutorial-3.png",
  },
  {
    label: "チャットを使って仲良くなろう！",
    imgPath: "/tutorial-4.png",
  },
  {
    label: "魅力的なカードを作ってね！",
    imgPath: "/tutorial-5.png",
  },
  {
    label: "実際にCourseMateを使ってみよう！下のボタンをクリック！",
    imgPath: "/tutorial-6.png",
  },
];

export default function Tutorial() {
  return (
    <div className="flex h-full flex-col">
      <div className="carousel w-full flex-1">
        {tutorialSteps.map((step, i) => (
          <div
            key={step.imgPath}
            id={`slide${i + 1}`}
            className="carousel-item relative w-full"
          >
            <div className="mx-auto flex max-w-[30vh] flex-col justify-center gap-8">
              <h2 className="text-center text-2xl">{step.label}</h2>
              <img
                src={step.imgPath}
                alt={step.label}
                className="w-full object-contain"
              />
            </div>
            <div className="-translate-y-1/2 absolute top-1/2 right-5 left-5 flex transform justify-between">
              <a
                href={`#slide${i === 0 ? tutorialSteps.length - 1 : i}`}
                className="btn btn-circle"
              >
                ❮
              </a>
              <a
                href={`#slide${i === tutorialSteps.length - 1 ? 1 : i + 2}`}
                className="btn btn-circle"
              >
                ❯
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 text-center">
        <Link href="/home" className="btn btn-primary w-full">
          ホーム画面へ
        </Link>
      </div>
    </div>
  );
}
