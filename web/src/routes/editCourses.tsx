import { Box, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import hooks from "../api/hooks";
import CoursesTable from "../components/course/CoursesTable";

export default function EditCourses() {
  const navigate = useNavigate();
  const { data, loading, error } = hooks.useMe();

  function handleBack() {
    navigate("/settings");
  }

  function handleGoToProfile() {
    navigate("/edit/profile");
  }

  return (
    <Box sx={{ padding: "20px", maxWidth: "350px", margin: "0 auto" }}>
      <h1>授業編集</h1>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : data ? (
        <>
          <CoursesTable userId={data.id} editable={true} />
        </>
      ) : (
        <p>データがありません。</p>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <Button variant="contained" onClick={handleBack}>
          設定画面に戻る
        </Button>
        <Button variant="contained" onClick={handleGoToProfile}>
          プロフィール編集へ
        </Button>
      </Box>
    </Box>
  );
}
