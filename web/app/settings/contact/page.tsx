import { Box, Button, Typography } from "@mui/material";
import { NavigateByAuthState } from "../../../components/common/NavigateByAuthState";
import TopNavigation from "../../../components/common/TopNavigation";

export default function Contact() {
  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <Box
        sx={{
          padding: "8px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TopNavigation title="お問い合わせ" />
        <Box
          sx={{
            width: "100%",
            padding: "30px",
            textAlign: "left",
          }}
        >
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
    </NavigateByAuthState>
  );
}
