import { Box, Button } from "@mui/material";
import { useAlert } from "./alert/useAlert";

type Action = {
  label: string;
  onClick: () => void;
  alert: boolean;
  messages?: AlertMessage;
};

type AlertMessage = {
  buttonMessage: string;
  AlertMessage: string;
  subAlertMessage?: string;
  yesMessage: string;
};

export default function Popup({ actions }: { actions: Action[] }) {
  const { showAlert } = useAlert();

  const handleActionClick = (action: Action) => {
    if (action.alert && action.messages) {
      showAlert({
        AlertMessage: action.messages.AlertMessage,
        subAlertMessage: action.messages.subAlertMessage,
        yesMessage: action.messages.yesMessage,
        clickYes: () => {
          action.onClick();
        },
      });
    } else {
      action.onClick();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        padding: 1,
        borderRadius: 2,
      }}
    >
      {actions.map((action, index) => (
        <Button key={index} onClick={() => handleActionClick(action)}>
          {action.label}
        </Button>
      ))}
    </Box>
  );
}
