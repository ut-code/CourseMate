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
import hooks from "../api/hooks";

export default function EditProfile() {
  const navigate = useNavigate();
  const { data, loading, error } = hooks.useMe();

  const handleNext = () => {
    navigate("/edit/courses"); // router.pushからnavigateに変更
  };

  const handleCancel = () => {
    navigate("/settings"); // router.pushからnavigateに変更
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
            <TextField label="名前" defaultValue={data.name} fullWidth />
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: "20px" }}>
            <InputLabel>性別</InputLabel>
            <Select defaultValue={data.gender}>
              <MenuItem value="男性">男性</MenuItem>
              <MenuItem value="女性">女性</MenuItem>
              <MenuItem value="その他">その他</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: "20px" }}>
            <InputLabel>学年</InputLabel>
            <Select defaultValue={data.grade}>
              <MenuItem value="B1">学部一年(B1)</MenuItem>
              <MenuItem value="B2">学部二年(B2)</MenuItem>
              <MenuItem value="B3">学部三年(B3)</MenuItem>
              <MenuItem value="B4">学部四年(B4)</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: "20px" }}>
            <InputLabel>学部</InputLabel>
            <Select defaultValue={data.faculity}>
              <MenuItem value="工学部">工学部</MenuItem>
              <MenuItem value="文学部">文学部</MenuItem>
              <MenuItem value="理学部">理学部</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: "20px" }}>
            <TextField
              label="自己紹介"
              defaultValue={data.intro}
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
