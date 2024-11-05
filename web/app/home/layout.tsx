import { Box } from "@mui/material";
import BottomBar from "../../components/BottomBar";
import Header from "../../components/Header";

export default function HomePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header title="ホーム/Home" />
      <Box
        sx={{
          position: "absolute", // TODO: absolute 指定しない
          top: {
            xs: "56px",
            sm: "64px",
          },
          bottom: "56px",
          left: 0,
          right: 0,
          overflowY: "auto",
        }}
      >
        {children}
      </Box>
      <BottomBar activeTab="0_home" />
    </>
  );
}
