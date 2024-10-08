import { ArrowBack } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "../../../api/user";
import { useAlert } from "../../../components/common/alert/AlertProvider";

export default function DeleteAccount() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { enqueueSnackbar } = useSnackbar();

  const onClick = useCallback(() => {
    showAlert({
      AlertMessage: "本当にアカウントを削除しますか？",
      subAlertMessage: "このアカウントに関連するすべてのデータが失われます。",
      yesMessage: "削除",
      clickYes: async () => {
        try {
          await deleteAccount();
          enqueueSnackbar("アカウントを削除しました", { variant: "success" });
        } catch (error) {
          console.error(error);
          enqueueSnackbar("アカウントの削除に失敗しました", {
            variant: "error",
          });
        } finally {
          navigate("/login");
        }
      },
    });
  }, [showAlert, enqueueSnackbar, navigate]);

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
          アカウント削除
        </Typography>

        <Typography sx={{ mb: "16px", lineHeight: "1.8", color: "red" }}>
          アカウントを削除した場合、マッチングやチャットに関する情報の一切が削除されます。
        </Typography>

        <Button
          variant="contained"
          color="error" // Red color for the button
          sx={{
            margin: "0 auto",
            textAlign: "center",
            display: "block",
            marginTop: "20px",
            padding: "12px",
            fontSize: "16px",
          }}
          onClick={onClick}
        >
          アカウントを削除する
        </Button>
      </Box>
    </Box>
  );
}
