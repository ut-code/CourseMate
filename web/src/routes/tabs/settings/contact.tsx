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
        justifyContent: "center",
      }}
    >
      <IconButton
        sx={{ position: "absolute", top: "20px", left: "20px" }}
        onClick={() => navigate("/settings")}
      >
        <ArrowBack />
      </IconButton>

      <Box
        sx={{
          width: "100%",
          padding: "30px",
          textAlign: "left",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ fontWeight: "bold", mb: "24px", textAlign: "center" }}
        >
          お問い合わせ
        </Typography>

        <Typography sx={{ mb: "16px", lineHeight: "1.8" }}>
          ご利用いただきありがとうございます。サービスに関するご意見やバグ報告がございましたら、以下のリンクからお問い合わせください。皆様のフィードバックは、サービスの改善に役立てさせていただきます。
        </Typography>

        <Button
          variant="contained"
          href="https://forms.gle/WvFTbsJoHjGp9Qt88"
          target="_blank"
          sx={{
            textAlign: "center",
            display: "block",
            marginTop: "20px",
            padding: "12px",
            fontSize: "16px",
          }}
        >
          ご意見・バグ報告をする
        </Button>
      </Box>
    </Box>
  );
}
