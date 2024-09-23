import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import hooks from "../api/hooks";
import { update } from "../api/user";
export default function EditProfile() {
  const navigate = useNavigate();
  const { data, loading, error } = hooks.useMe();

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [grade, setGrade] = useState("");
  const [faculity, setFaculity] = useState("");
  const [department, setDepartment] = useState("");
  const [intro, setIntro] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");

  useEffect(() => {
    if (data) {
      setName(data.name);
      setGender(data.gender);
      setGrade(data.grade);
      setFaculity(data.faculity);
      setDepartment(data.department);
      setIntro(data.intro);
      setPictureUrl(data.pictureUrl);
    }
  }, [data]);

  const handleNext = () => {
    navigate("/edit/courses");
    // データベースに反映したい
    update({
      name: name,
      gender: gender,
      grade: grade,
      faculity: faculity,
      department: department,
      intro: intro,
      pictureUrl: pictureUrl,
    });
  };

  const handleCancel = () => {
    navigate("/settings");
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "350px", margin: "0 auto" }}>
      <h1>アカウント編集</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : data ? (
        <>
          <p>名前</p>
          <FormControl fullWidth sx={{ marginBottom: "20px" }}>
            <TextField
              label="名前"
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: "20px" }}>
            <InputLabel>性別</InputLabel>
            <Select
              defaultValue={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <MenuItem value="男性">男性</MenuItem>
              <MenuItem value="女性">女性</MenuItem>
              <MenuItem value="その他">その他</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: "20px" }}>
            <InputLabel>学年</InputLabel>
            <Select
              defaultValue={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              <MenuItem value="B1">学部一年(B1)</MenuItem>
              <MenuItem value="B2">学部二年(B2)</MenuItem>
              <MenuItem value="B3">学部三年(B3)</MenuItem>
              <MenuItem value="B4">学部四年(B4)</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: "20px" }}>
            <InputLabel>学部</InputLabel>
            <Select
              defaultValue={faculity}
              onChange={(e) => setFaculity(e.target.value)}
            >
              <MenuItem value="工学部">工学部</MenuItem>
              <MenuItem value="文学部">文学部</MenuItem>
              <MenuItem value="理学部">理学部</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: "20px" }}>
            <TextField
              label="自己紹介"
              defaultValue={intro}
              onChange={(e) => setIntro(e.target.value)}
              multiline
              rows={4}
            />
          </FormControl>
        </>
      ) : (
        <p>データがありません。</p>
      )}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" onClick={handleCancel}>
          編集をキャンセル
        </Button>
        <Button variant="contained" onClick={handleNext}>
          次へ(授業選択)
        </Button>
      </Box>
    </Box>
  );
}
