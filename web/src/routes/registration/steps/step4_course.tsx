import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import hooks from "../../../api/hooks";
import CoursesTable from "../../../components/course/CoursesTable";
import { NextButton } from "../common";

export default function Step4() {
  const navigate = useNavigate();
  const { data, loading, error } = hooks.useMe();
  console.log(data);
  return (
    <Box>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : data ? (
        <Box mt={2} mx={2} display="flex" flexDirection="column" gap={2}>
          <CoursesTable userId={data.id} editable={true} />
          <NextButton onClick={() => navigate("/home")}>Go to Home</NextButton>
        </Box>
      ) : (
        <p>データがありません。</p>
      )}
    </Box>
  );
}
