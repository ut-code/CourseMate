"use client";

import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
    <div className="h-full ">
      <Swiper
        modules={[Navigation]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
      >
        {tutorialSteps.map((step) => (
          <SwiperSlide key={step.imgPath}>
            <div className="text-center ">
              <h1 className="m-6 font-bold text-3xl">{step.label}</h1>
              <img
                src={step.imgPath}
                alt={step.label}
                className="mx-auto block h-auto w-[60vw] max-w-[400px] "
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
