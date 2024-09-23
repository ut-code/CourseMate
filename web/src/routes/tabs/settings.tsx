import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom"; // react-router-dom の useNavigate を使用
import hooks from "../../api/hooks";
import { Card } from "../../components/Card";
import LogOutButton from "../../components/LogOutButton";

export default function Settings() {
  const navigate = useNavigate(); // useNavigate を定義
  const { data, loading, error } = hooks.useMe();

  // プロフィール編集画面に遷移
  const handleProfileEdit = () => {
    navigate("/edit/profile");
  };

  // // 時間割編集画面に遷移
  // const handleCoursesEdit = () => {
  //   navigate("/edit/courses");
  // };

  return (
    <Box sx={{ padding: "20px" }}>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : data ? (
        <>
          <IconButton onClick={handleProfileEdit}>
            <EditIcon />
          </IconButton>
          <Card displayedUser={data} />
          <LogOutButton />
        </>
      ) : (
        <p>データがありません。</p>
      )}
    </Box>
  );
}
