import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

import { UpdateUser } from "../../../common/types";
import userapi from "../api/user";

type EditUserDialogProps = {
  isOpen: boolean;
  close: () => void;
  defaultValue: UpdateUser;
};

const EditUserDialog: React.FC<EditUserDialogProps> = (
  props: EditUserDialogProps,
) => {
  const { isOpen, close, defaultValue } = props;
  const [name, setName] = useState(defaultValue.name);
  const [email, setEmail] = useState(defaultValue.email);
  const [pictureUrl, setPictureUrl] = useState(defaultValue.pictureUrl);

  const handleSave = async () => {
    const data: UpdateUser = {
      name: name,
      email: email,
      pictureUrl: pictureUrl,
    };
    await userapi.update(data);
    close();
  };

  return (
    <Dialog open={isOpen} onClose={close}>
      <DialogTitle>ユーザー情報を編集</DialogTitle>
      <DialogContent>
        <DialogContentText>
          ユーザーのIDとパスワードを編集してください。
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="名前"
          type="text"
          fullWidth
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          autoFocus
          margin="dense"
          label="連絡先"
          type="text"
          fullWidth
          variant="standard"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          autoFocus
          margin="dense"
          label="画像の URL (TODO)"
          type="url"
          fullWidth
          variant="standard"
          value={pictureUrl}
          onChange={(e) => setPictureUrl(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary">
          キャンセル
        </Button>
        <Button onClick={handleSave} color="primary">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;
