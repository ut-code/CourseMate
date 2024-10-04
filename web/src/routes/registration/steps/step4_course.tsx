import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import hooks from "../../../api/hooks";
import FullScreenCircularProgress from "../../../components/common/FullScreenCircularProgress";
import CoursesTable from "../../../components/course/CoursesTable";

export default function Step4() {
  const navigate = useNavigate();
  const { state } = hooks.useMe();
  return (
    <>
      <Box>
        {state.current === "loading" ? (
          <FullScreenCircularProgress />
        ) : state.current === "error" ? (
          <p>Error: {state.error.message}</p>
        ) : (
          <Box mt={2} mx={2} display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6" component="h1">
              授業情報の登録 (スキップ可)
            </Typography>
            <Box>
              <CoursesTable userId={state.data.id} editable={true} />
            </Box>
          </Box>
        )}
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
        <Button onClick={() => navigate("/home")} variant="contained">
          次へ
        </Button>
      </Box>
    </>
  );
}
