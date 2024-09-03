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
import { parseUpdateUser } from "../common/zod/methods";

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
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = async () => {
    try {
      if (!introS) {
        throw new Error("ひとことコメントは入力必須です。");
      }

      const pictureUrl = photo.upload && (await photo.upload());
      if (!pictureUrl) {
        throw new Error("画像は入力必須です。");
      }

      const data: UserData = {
        name: name,
        grade: grade,
        gender: gender,
        intro_short: introS,
        intro_long: introL,
        hobby: hobby,
        pictureUrl: pictureUrl || "",
      };
      parseUpdateUser(data);

      await save(data);
      if (onSave) onSave();
      if (def?.pictureUrl && pictureUrl) {
        deleteImage(def.pictureUrl);
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("入力に誤りがあります。");
      }
    }
  };

  return (
    <Box mt={2} mx={2} display="flex" flexDirection="column" gap={2}>
      <FormControl fullWidth>
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="名前(必須)"
        />
      </FormControl>
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
      <FormControl fullWidth>
        <TextField
          value={hobby}
          label="趣味"
          onChange={(e) => setHobby(e.target.value)}
        />
      </FormControl>
      <FormControl fullWidth>
        <TextField
          value={introS}
          label="ひとことコメント(必須)"
          onChange={(e) => setIntroS(e.target.value)}
        />
      </FormControl>
      <FormControl fullWidth>
        <TextField
          value={introL}
          label="自己紹介"
          onChange={(e) => setIntroL(e.target.value)}
        />
      </FormControl>
      <FormControl fullWidth>
        <PhotoPreview />
      </FormControl>
      {errorMessage && (
        <Box color="red" mb={2}>
          {errorMessage}
        </Box>
      )}
      {allowClose && (
        <Button onClick={onClose} color="primary">
          キャンセル
        </Button>
      )}
      <Button
        variant="outlined"
        sx={{ textTransform: "none" }}
        onClick={handleSave}
      >
        {saveButtonText}
      </Button>
    </Box>
  );
}
