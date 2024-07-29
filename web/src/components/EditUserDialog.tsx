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
  open: boolean;
  close: () => void;
};

const EditUserDialog: React.FC<EditUserDialogProps> = (
  props: EditUserDialogProps,
) => {
  const { open, close } = props;
  const [name, setName] = useState("");
  // NOTE: password is not used. consider deleting this.
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");

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
    <Dialog open={open} onClose={close}>
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
          margin="dense"
          label="パスワード"
          type="password"
          fullWidth
          variant="standard"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
