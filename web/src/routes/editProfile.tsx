import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();
  // const { data, loading, error } = hooks.useMe();

  const handleSave = () => {
    navigate("/settings"); // router.pushからnavigateに変更
  };

  const handleNext = () => {
    navigate("/edit/courses"); // router.pushからnavigateに変更
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "350px", margin: "0 auto" }}>
      <h1>アカウント編集</h1>
      <FormControl fullWidth sx={{ marginBottom: "20px" }}>
        <TextField label="名前" fullWidth />
      </FormControl>
      <FormControl fullWidth sx={{ marginBottom: "20px" }}>
        <InputLabel>性別</InputLabel>
        <Select defaultValue="">
          <MenuItem value="男性">男性</MenuItem>
          <MenuItem value="女性">女性</MenuItem>
          <MenuItem value="その他">その他</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ marginBottom: "20px" }}>
        <InputLabel>学年</InputLabel>
        <Select defaultValue="">
          <MenuItem value="B1">学部一年(B1)</MenuItem>
          <MenuItem value="B2">学部二年(B2)</MenuItem>
          <MenuItem value="B3">学部三年(B3)</MenuItem>
          <MenuItem value="B4">学部四年(B4)</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ marginBottom: "20px" }}>
        <InputLabel>学部</InputLabel>
        <Select defaultValue="">
          <MenuItem value="工学部">工学部</MenuItem>
          <MenuItem value="文学部">文学部</MenuItem>
          <MenuItem value="理学部">理学部</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ marginBottom: "20px" }}>
        <TextField label="自己紹介" multiline rows={4} />
      </FormControl>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" onClick={handleNext}>
          次へ
        </Button>
        <Button variant="contained" onClick={handleSave}>
          登録
        </Button>
      </Box>
    </Box>
  );
}
