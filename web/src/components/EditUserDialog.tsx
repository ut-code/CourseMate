import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';

type EditUserDialogProps = {
  userId: number;
  open: boolean;
  onClose: () => void;
};

const EditUserDialog: React.FC<EditUserDialogProps> = (props: EditUserDialogProps) => {

  const {userId, open, onClose} = props;
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email,setEmail] = useState("")

  const handleSave = async () => {
    const url = `${import.meta.env.VITE_API_ENDPOINT}/users/${userId}`
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          password: name,
          email: email, 
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      onClose();
    } catch (error) {
      console.error('Error updating user information:', error);
    }
  }


  return (
    <Dialog open={open} onClose={onClose}>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
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
