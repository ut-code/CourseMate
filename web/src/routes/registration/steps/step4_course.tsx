import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useMyID } from "../../../api/user";
import CoursesTable from "../../../components/course/CoursesTable";
import { NextButton } from "../common";

export default function Step4() {
  const navigate = useNavigate();
  const { state } = useMyID();
  return (
    <Box>
      {state.current === "loading" ? (
        <CircularProgress />
      ) : state.current === "error" ? (
        <p>Error: {state.error.message}</p>
      ) : (
        <Box
          mt={2}
          mx={2}
          display="flex"
          flexDirection="column"
          gap={2}
          alignItems="center"
        >
          <p>授業情報を登録しましょう</p>
          <CoursesTable userId={state.data} editable={true} />
          <NextButton onClick={() => navigate("/home")}>次へ</NextButton>
        </Box>
      )}
    </Box>
  );
}
