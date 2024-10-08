import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Header from "../components/Header";

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
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        top: "56px",
        bottom: 0,
        left: 0,
        right: 0,
        overflowY: "auto",
      }}
    >
      <Header title="チュートリアル/Tutorial" />
      <Box
        sx={{
          textAlign: "left",
        }}
      >
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          style={{
            paddingBottom: "60px",
          }}
        >
          {tutorialSteps.map((step) => (
            <SwiperSlide key={step.imgPath}>
              <Box sx={{ textAlign: "center", mb: "24px" }}>
                <Typography
                  variant="h6"
                  component="h1"
                  gutterBottom
                  sx={{ fontWeight: "bold", mb: "16px" }}
                >
                  {step.label}
                </Typography>
                <img
                  src={step.imgPath}
                  alt={step.label}
                  style={{
                    display: "block",
                    width: "60vw",
                    height: "calc(60vw·*·(667·/·375))",
                    maxWidth: 400,
                    overflow: "hidden",
                    margin: "auto",
                  }}
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/home")}
            sx={{ width: "100%" }}
          >
            ホーム画面へ
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
