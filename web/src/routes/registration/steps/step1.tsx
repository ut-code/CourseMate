import { useState } from "react";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { StepProps, NextButton } from "../common";

export type Step1Data = {
  name: string;
  gender: string;
  grade: string; // todo: make it enum
  faculity: string; // 学部
  department: string; // 学科
  intro: string;
};

export default function Step1({ onSave, prev, caller }: StepProps<Step1Data>) {
  const [name, setName] = useState(prev?.name ?? "");
  const [gender, setGender] = useState(prev?.gender ?? "その他");
  const [grade, setGrade] = useState(prev?.grade ?? "");
  const [faculity, setFaculity] = useState(prev?.faculity ?? "");
  const [department, setDepartment] = useState(prev?.department ?? "");
  const [intro, setIntro] = useState(prev?.intro ?? "");
  const [errorMessage, setErrorMessage] = useState("");

  async function save() {
    try {
      // FIXME: create zod schema!
      const data: Step1Data = {
        name,
        grade,
        gender,
        faculity,
        department,
        intro,
      };
      onSave(data);
    } catch (error) {
      if (error instanceof Error) {
        let errorMessages;
        try {
          const parsedError = JSON.parse(error.message);
          if (Array.isArray(parsedError)) {
            errorMessages = parsedError.map((err) => err.message).join(", ");
          } else {
            errorMessages = error.message;
          }
        } catch {
          errorMessages = error.message;
        }

        // エラーメッセージをセット
        setErrorMessage(errorMessages);
      } else {
        console.log("unknown error:", error);
        setErrorMessage("入力に誤りがあります。");
      }
    }
  }

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
        <InputLabel>性別</InputLabel>
        <Select
          value={gender}
          label="Gender"
          onChange={(e) => setGender(e.target.value)}
        >
          <MenuItem value={"男性"}>男性</MenuItem>
          <MenuItem value={"女性"}>女性</MenuItem>
          <MenuItem value={"その他"}>その他</MenuItem>
          <MenuItem value={"秘密"}>秘密</MenuItem>
        </Select>
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
        <TextField
          value={faculity}
          label="学部"
          onChange={(e) => setFaculity(e.target.value)}
        />
      </FormControl>
      <FormControl fullWidth>
        <TextField
          value={department}
          label="学科"
          onChange={(e) => setDepartment(e.target.value)}
        />
      </FormControl>
      <FormControl fullWidth>
        <TextField
          multiline
          label="自己紹介"
          minRows={3}
          placeholder="Rust が好きです。"
          onChange={(e) => setIntro(e.target.value)}
        />
      </FormControl>
      {errorMessage && (
        <Box color="red" mb={2}>
          {errorMessage}
        </Box>
      )}
      <NextButton caller={caller} onClick={save}>
        {caller === "registration" ? "次へ" : "保存"}
      </NextButton>
    </Box>
  );
}
