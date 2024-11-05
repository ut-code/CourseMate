import { Box, Typography } from "@mui/material";
import { NavigateByAuthState } from "../../../components/common/NavigateByAuthState";
import TopNavigation from "../../../components/common/TopNavigation";

export default function Disclaimer() {
  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <Box
        sx={{
          padding: "8px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TopNavigation title="免責事項" />
        <Box
          sx={{
            width: "100%",
            maxWidth: "600px",
            padding: "30px",
            textAlign: "left",
          }}
        >
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
    </NavigateByAuthState>
  );
}
