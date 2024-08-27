import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

import { UpdateUser } from "../common/types";
import userapi from "../api/user";
import { photo } from "./data/photo-preview";
import { EditUserBox, UserData } from "./EditUserBox";

type EditUserDialogProps = {
  isOpen: boolean;
  close: () => void;
  defaultValue: UpdateUser;
};

const EditUserDialog: React.FC<EditUserDialogProps> = (
  props: EditUserDialogProps,
) => {
  const { isOpen, close, defaultValue } = props;
  const onClose = () => {
    photo.upload = null;
    close();
  };

  const save = async (data: UserData) => {
    await userapi.update(data);
  };
  const onSave = () => {
    close();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>ユーザー情報を編集</DialogTitle>
      <DialogContent>
        <EditUserBox
          defaultValue={defaultValue}
          save={save}
          onSave={onSave}
          saveButtonText="保存"
          allowClose={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
