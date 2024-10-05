import { ListItemButton, ListItemText } from "@mui/material";
import { useSnackbar } from "notistack";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "../api/user";
import { useAlert } from "./common/alert/AlertProvider";

export default function DeleteAccountButton() {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
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
    <ListItemButton onClick={onClick}>
      <ListItemText primary="アカウントを削除" sx={{ color: "red" }} />
    </ListItemButton>
  );
}
