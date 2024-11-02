import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useMyID } from "../../../api/user";
import FullScreenCircularProgress from "../../../components/common/FullScreenCircularProgress";
import EditableCoursesTable from "../../../components/course/EditableCoursesTable";
import { useRouter } from "next/navigation";

export default function Step4() {
  const router = useRouter();
  const { state } = useMyID();
  return (
    <>
      <Box>
        {state.current === "loading" ? (
          <FullScreenCircularProgress />
        ) : state.current === "error" ? (
          <div>Error: {state.error.message}</div>
        ) : (
          <Box mt={2} mx={2} display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6" component="h1">
              授業情報の登録 (スキップ可)
            </Typography>
            <Box>
              <EditableCoursesTable userId={state.data} />
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
        <Button onClick={() => router.push("/tutorial")} variant="contained">
          次へ
        </Button>
      </Box>
    </>
  );
}
