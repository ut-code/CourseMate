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
        minHeight: "100vh",
        bgcolor: "#f9f9f9",
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
          maxWidth: "800px",
          marginTop: "60px",
          padding: "20px",
          bgcolor: "white",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: "bold" }}
        >
          免責事項
        </Typography>

        <Typography
          variant="body1"
          paragraph
          sx={{ lineHeight: 1.8, marginBottom: "16px" }}
        >
          本サービスはut.code();によって運営されており、東京大学は運営に関与しておりません。本サービスは東大生のみを対象としており、ECCSアカウントによるログインが必須です。
        </Typography>

        <Typography
          variant="body1"
          paragraph
          sx={{ lineHeight: 1.8, marginBottom: "16px" }}
        >
          本サービスの機能には、マッチング機能、チャット機能、および授業登録機能が含まれますが、これらの機能の利用に伴ういかなるトラブルや損害について、ut.code();は一切の責任を負いかねます。利用者の自己責任においてご利用ください。
        </Typography>

        <Typography
          variant="body1"
          paragraph
          sx={{ lineHeight: 1.8, marginBottom: "16px" }}
        >
          本サービスで収集した個人情報は、サインインおよびサービス提供の目的にのみ使用され、他の目的には使用されません。収集されたデータはut.code();が管理するサーバーに保存されます。
        </Typography>

        <Typography
          variant="body1"
          paragraph
          sx={{ lineHeight: 1.8, marginBottom: "16px" }}
        >
          本サービスを通じて他の利用者と接触した際のトラブルや、マッチングを通じて生じた問題等に関しても、ut.code();は責任を負いません。ご理解とご協力をお願いいたします。
        </Typography>
      </Box>
    </Box>
  );
}
