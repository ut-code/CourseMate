import { ArrowBack } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

/**
 * Settings の子ページから Setting に戻るナビゲーションを提供
 */
export default function TopNavigation({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <Box
      py={1}
      sx={{
        display: "flex",
        alignItems: "center",
        height: "min(56px, 7vh)",
      }}
    >
      <IconButton
        onClick={() => {
          navigate("/settings");
        }}
      >
        <ArrowBack />
      </IconButton>
      <Typography
        variant="h5"
        component="h1"
        sx={{
          fontWeight: "bold",
          // タイトルを中央に寄せる。矢印が左にしかないため。
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}
