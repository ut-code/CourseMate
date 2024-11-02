import { useState } from "react";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { parseStep1UserSchema } from "../../../common/zod/methods";
import type { Step1User } from "../../../common/zod/types";
import type { StepProps } from "../common";
import { facultiesAndDepartments } from "../data";

export default function Step1({ onSave, prev, caller }: StepProps<Step1User>) {
  const [name, setName] = useState(prev?.name ?? "");
  const [gender, setGender] = useState(prev?.gender ?? "その他");
  const [grade, setGrade] = useState(prev?.grade ?? "");
  const [faculty, setFaculty] = useState(prev?.faculty ?? "");
  const [department, setDepartment] = useState(prev?.department ?? "");
  const [intro, setIntro] = useState(prev?.intro ?? "");
  const [errorMessage, setErrorMessage] = useState("");

  async function save() {
    try {
      const data: Step1User = {
        name: name.trim(),
        grade: grade,
        gender: gender,
        faculty: faculty,
        department: department,
        intro: intro.trim(),
      };
      parseStep1UserSchema(data);
      onSave(data);
    } catch (error) {
      if (error instanceof Error) {
        let errorMessages: string;
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

  const handleFacultyChange = (event: SelectChangeEvent<string>) => {
    setFaculty(event.target.value);
  };

  const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
    setDepartment(event.target.value);
  };

  return (
    <>
      <Box mt={2} mx={2} display="flex" flexDirection="column" gap={2}>
        <Typography variant="h6" component="h1">
          アカウント設定
        </Typography>
        <Box flex={1} display="flex" flexDirection="column" gap={2}>
          <FormControl fullWidth>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="名前"
              autoComplete="off"
            />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>性別</InputLabel>
            <Select
              value={gender}
              label="性別"
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
              label="学年"
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
            <InputLabel>学部</InputLabel>
            <Select value={faculty} label="学部" onChange={handleFacultyChange}>
              {Object.keys(facultiesAndDepartments).map((fac) => (
                <MenuItem key={fac} value={fac}>
                  {fac}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>学科 (先に学部を選択して下さい)</InputLabel>
            <Select
              value={department}
              onChange={handleDepartmentChange}
              disabled={!faculty}
              label="学科(先に学部を選択して下さい)"
            >
              {faculty &&
                facultiesAndDepartments[faculty].map((dep) => (
                  <MenuItem key={dep} value={dep}>
                    {dep}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <TextField
              multiline
              label="自己紹介"
              minRows={3}
              placeholder="こんにちは！仲良くして下さい！"
              onChange={(e) => setIntro(e.target.value)}
            />
          </FormControl>
          {errorMessage && (
            <Box color="red" mb={2}>
              {errorMessage}
            </Box>
          )}
        </Box>
      </Box>
      <Box
        p={3}
        sx={{
          position: "fixed",
          display: "flex",
          justifyContent: "space-between",
          bottom: 0,
          width: "100%",
        }}
      >
        <span />
        <Button onClick={save} variant="contained">
          {caller === "registration" ? "次へ" : "保存"}
        </Button>
      </Box>
    </>
  );
}
