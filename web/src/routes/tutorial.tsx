import { ArrowBack } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Header from "../components/Header";

const tutorialSteps = [
  {
    label: "気になった人に「いいね」を送ろう！",
    imgPath: "/tutorial-1.png",
  },
  {
    label: "相手からのリクエストが来たら...",
    imgPath: "/tutorial-2.png",
  },
  {
    label: "リクエストを承認して、マッチング！",
    imgPath: "/tutorial-3.png",
  },
  {
    label: "マッチングした人とチャットをして、仲を深めよう！",
    imgPath: "/tutorial-4.png",
  },
  {
    label: "カードを編集して、より魅力的なカードを作ろう！",
    imgPath: "/tutorial-5.png",
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
      <IconButton
        sx={{ position: "absolute", top: "20px", left: "20px" }}
        onClick={() => navigate(-1)}
      >
        <ArrowBack />
      </IconButton>

      <Box
        sx={{
          width: "100%",
          maxWidth: "600px",
          padding: "30px",
          textAlign: "left",
        }}
      >
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
        >
          {tutorialSteps.map((step) => (
            <SwiperSlide key={step.imgPath}>
              <Typography
                variant="h5"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold", mb: "24px", textAlign: "center" }}
              >
                {step.label}
              </Typography>
              <img
                src={step.imgPath}
                alt={step.label}
                style={{
                  height: 255,
                  display: "block",
                  maxWidth: 400,
                  overflow: "hidden",
                  width: "100%",
                  margin: "0 auto",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
}
