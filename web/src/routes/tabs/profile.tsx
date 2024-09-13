import { Box, Button } from "@mui/material";
import LogOutButton from "../../components/LogOutButton";
import { useState } from "react";
import EditUserDialog from "../../components/EditUserDialog";
import CoursesTable from "../../components/course/CoursesTable";
import hooks from "../../api/hooks";
import UserAvatar from "../../components/human/avatar";

export default function Profile() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data, loading, error, reload } = hooks.useMe();

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <Box>
      {loading ? (
        <p>Loading...</p>
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
            <CoursesTable />
          </Box>
          <LogOutButton />
          <Button color="inherit" onClick={handleDialogOpen}>
            プロフィールを編集
          </Button>
          <EditUserDialog
            defaultValue={data}
            isOpen={isDialogOpen}
            close={() => {
              handleDialogClose();
              reload();
            }}
          />
        </>
      ) : (
        <p>データがありません。</p>
      )}
    </Box>
  );
}
