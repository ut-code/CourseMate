import { Box, Button } from "@mui/material";
import { useAlert } from "./alert/AlertProvider";

type Action = {
  label: string;
  color?: string;
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

  function handleActionClick(action: Action) {
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
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        width: "132px",
        height: "100%",
        boxShadow: 2,
      }}
    >
      {actions.map((action) => (
        <Button
          key={action.label}
          onClick={() => handleActionClick(action)}
          sx={{
            color: `${action.color}`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {action.label}
        </Button>
      ))}
    </Box>
  );
}
