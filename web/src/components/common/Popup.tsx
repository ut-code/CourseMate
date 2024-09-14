import { Box, Button } from "@mui/material";
import AlertDialog from "./AlertDialog";
import { useState } from "react";

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
  const [openAlert, setOpenAlert] = useState<AlertMessage | null>(null);

  const handleActionClick = (action: Action) => {
    if (action.alert && action.messages) {
      setOpenAlert(action.messages);
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

      {openAlert && (
        <AlertDialog
          buttonMessage={openAlert.buttonMessage}
          AlertMessage={openAlert.AlertMessage}
          subAlertMessage={openAlert.subAlertMessage}
          yesMessage={openAlert.yesMessage}
          clickYes={() => {
            actions.find((a) => a.messages === openAlert)?.onClick();
          }}
        />
      )}
    </Box>
  );
}
