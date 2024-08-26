import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Gender, User } from "../common/types";
import { photo } from "../components/data/photo-preview";

import { useState } from "react";
import { PhotoPreview } from "./PhotoPreview";
import { deleteImage } from "../firebase/store/photo";

type Props = {
  save: (userData: UserData) => Promise<void>;
  onSave?: () => void;
  saveButtonText: string;
  allowClose: boolean;
  onClose?: () => void;
  defaultValue?: UserData;
};
export type UserData = Omit<Omit<User, "id">, "guid">;

export function EditUserBox({
  save,
  onSave,
  saveButtonText,
  allowClose,
  onClose,
  defaultValue: def,
}: Props) {
  const [name, setName] = useState(def?.name || "");
  const [grade, setGrade] = useState(def?.grade || "");
  const [gender, setGender] = useState<Gender>(
    (def?.gender as Gender) || "その他",
  );
  const [hobby, setHobby] = useState(def?.hobby || "");
  const [introS, setIntroS] = useState(def?.intro_short || "");
  const [introL, setIntroL] = useState(def?.intro_long || "");

  return (
    <Box mt={2} mx={2} display="flex" flexDirection="column" gap={2}>
      <TextField
        value={name}
        onChange={(e) => setName(e.target.value)}
        label="Name"
      />
      <FormControl fullWidth>
        <InputLabel>学年</InputLabel>
        <Select
          value={grade}
          label="Grade"
          onChange={(e) => setGrade(e.target.value)}
        >
          <MenuItem value={"B1"}>1年生 (B1)</MenuItem>
          <MenuItem value={"B2"}>2年生 (B2)</MenuItem>
          <MenuItem value={"B3"}>3年生 (B3)</MenuItem>
          <MenuItem value={"B4"}>4年生 (B4)</MenuItem>
          <MenuItem value={"M1"}>修士1年 (M1)</MenuItem>
          <MenuItem value={"M2"}>修士2年 (M2)</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>性別</InputLabel>
        <Select
          value={gender}
          label="Gender"
          onChange={(e) => setGender(e.target.value as Gender)}
        >
          <MenuItem value={"男性"}>男性</MenuItem>
          <MenuItem value={"女性"}>女性</MenuItem>
          <MenuItem value={"その他"}>その他</MenuItem>
          <MenuItem value={"秘密"}>秘密</MenuItem>
        </Select>
      </FormControl>
      <TextField
        value={hobby}
        label="趣味"
        onChange={(e) => setHobby(e.target.value)}
      />
      <TextField
        value={introS}
        label="ひとことコメント"
        onChange={(e) => setIntroS(e.target.value)}
      />
      <TextField
        value={introL}
        label="自己紹介"
        onChange={(e) => setIntroL(e.target.value)}
      />
      <PhotoPreview />
      {allowClose && (
        <Button onClick={onClose} color="primary">
          キャンセル
        </Button>
      )}
      <Button
        variant="outlined"
        sx={{ textTransform: "none" }}
        onClick={() =>
          (async () => {
            const pictureUrl = photo.upload && (await photo.upload());
            const data: UserData = {
              name,
              grade,
              gender,
              intro_short: introS,
              intro_long: introL,
              hobby,
              pictureUrl: pictureUrl || "",
            };
            await save(data);
            if (onSave) onSave();
            if (def?.pictureUrl && pictureUrl !== null) {
              deleteImage(def.pictureUrl);
            }
          })()
        }
      >
        {saveButtonText}
      </Button>
    </Box>
  );
}
