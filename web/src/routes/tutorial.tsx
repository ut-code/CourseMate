import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, type SwiperClass, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useState } from "react";

const tutorialSteps = [
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
    label: "チュートリアル完了！",
  },
];

export default function Tutorial() {
  const navigate = useNavigate();
  const [isLastSlide, setIsLastSlide] = useState(false);

  const handleSlideChange = (swiper: SwiperClass) => {
    if (swiper.activeIndex === tutorialSteps.length - 1) {
      setIsLastSlide(true);
    } else {
      setIsLastSlide(false);
    }
  };

  return (
    <Box
      sx={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
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
          onSlideChange={handleSlideChange}
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
          {isLastSlide && (
            <Box sx={{ textAlign: "center", mt: "20px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/home")}
              >
                ホーム画面へ
              </Button>
            </Box>
          )}
        </Swiper>
      </Box>
    </Box>
  );
}
