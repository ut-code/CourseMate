import { ArrowBack, GitHub, Language } from "@mui/icons-material";
import XIcon from "@mui/icons-material/X";
import { Box, IconButton, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AboutUs() {
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
        position: "relative",
      }}
    >
      <IconButton
        sx={{ position: "absolute", top: "20px", left: "20px" }}
        onClick={() => navigate("/settings")}
      >
        <ArrowBack />
      </IconButton>
      <Typography variant="h4" component="h2" gutterBottom>
        About Us
      </Typography>
      <p>
        ut.code();
        は、2019年設立の東京大学のソフトウェアエンジニアリングコミュニティです。
      </p>
      <p>
        <Link href="https://utcode.net" target="_blank">
          <Language /> ウェブサイト
        </Link>
      </p>
      <p>
        <Link href="https://github.com/ut-code" target="_blank">
          <GitHub /> ut.code(); の GitHub
        </Link>
      </p>
      <p>
        <Link href="https://x.com/utokyo_code" target="_blank">
          <XIcon /> X (旧 Twitter)
        </Link>
      </p>
    </Box>
  );
}
