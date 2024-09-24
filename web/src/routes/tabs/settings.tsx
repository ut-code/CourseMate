import EditIcon from "@mui/icons-material/Edit";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom"; // react-router-dom の useNavigate を使用
import hooks from "../../api/hooks";
import { Card } from "../../components/Card";
import LogOutButton from "../../components/LogOutButton";
// import CoursesTable from "../../components/course/CoursesTable";
// import UserAvatar from "../../components/human/avatar";

export default function Settings() {
  const navigate = useNavigate(); // useNavigate を定義
  const { data, loading, error } = hooks.useMe();

  // プロフィール編集画面に遷移
  function handleProfileEdit() {
    navigate("/edit/profile");
  }

  return (
    <Box
      sx={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: "100vh",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : data ? (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center", // アイコンとテキストを縦に揃える
              justifyContent: "space-between", // テキストとアイコンを左右に配置
              width: "75%",
              maxWidth: "500px", // カード幅に合わせて調整
            }}
          >
            <Typography variant="h6" sx={{ marginRight: 1 }}>
              あなたのカード
            </Typography>
            <IconButton onClick={handleProfileEdit}>
              <EditIcon sx={{ color: "#039BE5" }} fontSize="large" />{" "}
              {/* アイコン色変更 */}
            </IconButton>
          </Box>
          <Card displayedUser={data} />
          <LogOutButton />
        </>
      ) : (
        <p>データがありません。</p>
      )}
    </Box>
  );
}
