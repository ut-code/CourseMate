import { Box, Button, CircularProgress } from "@mui/material";
import hooks from "../../api/hooks";
import LogOutButton from "../../components/LogOutButton";
import UserAvatar from "../../components/avatar/avatar";
// import { useState } from "react";
import CoursesTable from "../../components/course/CoursesTable";

export default function Settings() {
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data, loading, error } = hooks.useMe();

  const handleDialogOpen = () => {
    // setIsDialogOpen(true);
  };

  // const handleDialogClose = () => {
  // setIsDialogOpen(false);
  // };

  return (
    <Box>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : data ? (
        <>
          <Box>
            <p>名前: {data.name}</p>
            <p>ID: {data.id}</p>
            <UserAvatar
              pictureUrl={data.pictureUrl}
              width="300px"
              height="300px"
            />
            <CoursesTable editable userId={data.id} />
          </Box>
          <LogOutButton />
          <Button color="inherit" onClick={handleDialogOpen}>
            プロフィールを編集
          </Button>
        </>
      ) : (
        <p>データがありません。</p>
      )}
    </Box>
  );
}
