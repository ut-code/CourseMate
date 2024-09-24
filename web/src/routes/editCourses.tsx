import { Box, Button } from "@mui/material";
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
      <h1>授業選択</h1>
      {loading ? (
        <p>Loading...</p>
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
          ホームに戻る
        </Button>
        <Button variant="contained" onClick={handleGoToProfile}>
          プロフィール設定へ
        </Button>
      </Box>
    </Box>
  );
}
