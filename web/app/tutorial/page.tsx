"use client";

import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import Header from "~/components/Header";

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
    <div className="absolute inset-0 flex flex-col overflow-y-auto px-5 pt-14">
      <Header title="チュートリアル/Tutorial" />
      <div className="text-left">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className="pb-16"
        >
          {tutorialSteps.map((step) => (
            <SwiperSlide key={step.imgPath}>
              <div className="mb-6 text-center">
                <h1 className="mb-4 font-bold text-lg">{step.label}</h1>
                <img
                  src={step.imgPath}
                  alt={step.label}
                  className="mx-auto block h-auto w-[60vw] max-w-[400px]"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="text-center">
          <Link href="/home" className="btn btn-primary w-full">
            ホーム画面へ
          </Link>
        </div>
      </div>
    </div>
  );
}
