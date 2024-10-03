import { ArrowBack } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        textAlign: "center",
      }}
    >
      <IconButton
        sx={{ position: "absolute", top: "20px", left: "20px" }}
        onClick={() => navigate(-1)} // 1つ前のページに戻る
      >
        <ArrowBack />
      </IconButton>
      <Typography variant="h6" component="h2" sx={{ marginTop: "20px" }}>
        お問い合わせ
      </Typography>
      <Button
        variant="contained"
        href="https://forms.gle/WvFTbsJoHjGp9Qt88"
        target="_blank"
        sx={{ marginTop: "10px" }}
      >
        ご意見・バグ報告をする
      </Button>
    </Box>
  );
}
