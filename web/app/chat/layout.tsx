import { Box } from "@mui/material";
import BottomBar from "../../components/BottomBar";
import Header from "../../components/Header";

export default function ChatPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header title="チャット/Chat" />
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
      <BottomBar activeTab="2_chat" />
    </>
  );
}
