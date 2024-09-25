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
    <Box sx={{ padding: "20px", textAlign: "center" }}>
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
        <Button
          onClick={handleBack}
          style={{
            borderRadius: "25px",
            width: "35vw",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          設定画面に戻る
        </Button>
        <Button
          variant="contained"
          onClick={handleGoToProfile}
          style={{
            borderRadius: "25px",
            width: "35vw",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          プロフィール編集へ
        </Button>
      </Box>
    </Box>
  );
}
