import { ArrowBack } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Disclaimer() {
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
      <Typography variant="h4" component="h1" gutterBottom>
        免責事項
      </Typography>
      <Typography variant="body1" paragraph>
        本サービスと東京大学の関係 本サービスは
        ut.code();によって運営されており、東京大学は一切運営に関与していません。本サービスは使用を東大生に限定したサービスであり、ECCSアカウントのみでログインできます。本サービスで利用されているデータの一切はut.code();
        が保有するサーバーに保存されています。
      </Typography>
    </Box>
  );
}
