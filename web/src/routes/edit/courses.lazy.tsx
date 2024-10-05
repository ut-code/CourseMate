import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useAboutMe } from "../../api/user";
import FullScreenCircularProgress from "../../components/common/FullScreenCircularProgress";
import CoursesTable from "../../components/course/CoursesTable";

export const Route = createLazyFileRoute("/edit/courses")({
  component: EditCourses,
});
function EditCourses() {
  const navigate = useNavigate();

  const { state } = useAboutMe();
  const data = state.data;
  const loading = state.current === "loading";
  const error = state.current === "error" ? state.error : null;

  function handleBack() {
    navigate({ to: "/settings/profile" });
  }

  function handleGoToProfile() {
    navigate({ to: "/edit/profile" });
  }

  return (
    <Box
      sx={{
        padding: "20px",
        maxWidth: "350px",
        height: "100%",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <Typography variant="h6" component="h1" mb={1}>
        授業編集
      </Typography>
      {loading ? (
        <FullScreenCircularProgress />
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
