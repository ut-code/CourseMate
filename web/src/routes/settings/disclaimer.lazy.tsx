import { ArrowBack } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/settings/disclaimer")({
  component: Disclaimer,
});
function Disclaimer() {
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
        onClick={() => navigate({ to: "/settings" })}
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
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", mb: "24px", textAlign: "center" }}
        >
          免責事項
        </Typography>

        <Typography
          variant="body1"
          paragraph
          sx={{ lineHeight: 1.8, mb: "16px" }}
        >
          本サービスはut.code();によって運営されており、東京大学は運営に関与しておりません。本サービスは東大生のみを対象としており、ECCSアカウントによるログインが必須です。
        </Typography>

        <Typography
          variant="body1"
          paragraph
          sx={{ lineHeight: 1.8, mb: "16px" }}
        >
          本サービスの機能の利用に伴ういかなるトラブルや損害について、ut.code();は一切の責任を負いかねます。利用者の自己責任においてご利用ください。
        </Typography>

        <Typography
          variant="body1"
          paragraph
          sx={{ lineHeight: 1.8, mb: "16px" }}
        >
          本サービスで収集した個人情報は、サインインおよびサービス提供の目的にのみ使用され、他の目的には使用されません。
        </Typography>

        <Typography
          variant="body1"
          paragraph
          sx={{ lineHeight: 1.8, mb: "16px" }}
        >
          本サービスを通じて他の利用者と接触した際のトラブルや、マッチングを通じて生じた問題等に関しても、ut.code();は責任を負いません。ご理解とご協力をお願いいたします。
        </Typography>
      </Box>
    </Box>
  );
}
