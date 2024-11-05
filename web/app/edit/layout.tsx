import { Box } from "@mui/material";
import Header from "../../components/Header";

export default function EditPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header title="編集/Edit" />
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
    </>
  );
}
