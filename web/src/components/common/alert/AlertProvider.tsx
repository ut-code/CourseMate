import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { type ReactNode, createContext, useContext, useState } from "react";

export type Alert = {
  AlertMessage: string;
  subAlertMessage?: string;
  yesMessage: string;
  clickYes?: () => void;
};

export type AlertContextType = {
  showAlert: (alertProps: Alert) => void;
};

type AlertProviderProps = {
  children: ReactNode;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: AlertProviderProps) => {
  const [alertProps, setAlertProps] = useState<Alert | null>(null);

  const showAlert = (props: Alert) => {
    setAlertProps(props);
  };

  const handleClose = () => {
    setAlertProps(null);
  };

  const handleYesClick = () => {
    if (alertProps?.clickYes) {
      alertProps.clickYes();
    }
    handleClose();
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alertProps && (
        <Dialog
          open={true}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {alertProps.AlertMessage}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {alertProps.subAlertMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleYesClick} autoFocus sx={{ color: "red" }}>
              {alertProps.yesMessage}
            </Button>
            <Button onClick={handleClose}>キャンセル</Button>
          </DialogActions>
        </Dialog>
      )}
    </AlertContext.Provider>
  );
};

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}
