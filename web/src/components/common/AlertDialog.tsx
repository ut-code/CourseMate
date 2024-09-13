import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";

type Props = {
  buttonMessage: string;
  AlertMessage: string;
  subAlertMessage?: string;
  yesMessage: string;
  clickYes?: () => void;
};

export default function AlertDialog(props: Props) {
  const { buttonMessage, AlertMessage, subAlertMessage, yesMessage, clickYes } =
    props;
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleYesClick = () => {
    if (clickYes) {
      clickYes();
    }
    handleClose();
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        {buttonMessage}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{AlertMessage}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {subAlertMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button onClick={handleYesClick} autoFocus>
            {yesMessage}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
