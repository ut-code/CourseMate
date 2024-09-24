import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import hooks from "../../../api/hooks";
import CoursesTable from "../../../components/course/CoursesTable";
import { NavigationButton } from "../common";

export default function Step4() {
  const navigate = useNavigate();
  const { data, loading, error } = hooks.useMe();
  return (
    <Box>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : data ? (
        <Box
          mt={2}
          mx={2}
          display="flex"
          flexDirection="column"
          gap={2}
          alignItems="center"
        >
          <p>授業情報を登録しましょう</p>
          <CoursesTable userId={data.id} editable={true} />
          <NavigationButton onClick={() => navigate("/home")}>
            完了
          </NavigationButton>
        </Box>
      ) : (
        <p>データがありません。</p>
      )}
    </Box>
  );
}
