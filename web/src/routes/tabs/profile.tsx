import { Box, Button } from "@mui/material";
import LogOutButton from "../../components/LogOutButton";
import { useState } from "react";
import EditUserDialog from "../../components/EditUserDialog";
import EditUserCourseDialog from "../../components/EditUserCourseDialog";
import hooks from "../../api/hooks";
import UserAvatar from "../../components/avatar/avatar";

export default function Profile() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const { data, loading, error, reload } = hooks.useMe();

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleCourseDialogOpen = () => {
    setIsCourseDialogOpen(true);
  };

  const handleCourseDialogClose = () => {
    setIsCourseDialogOpen(false);
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
            <p>Name: {data.name}</p>
            <p>ID: {data.id}</p>
            <UserAvatar
              pictureUrl={data.pictureUrl}
              width="300px"
              height="300px"
            />
          </Box>
          <LogOutButton />
          <Button color="inherit" onClick={handleDialogOpen}>
            プロフィールを編集
          </Button>
          <Button color="inherit" onClick={handleCourseDialogOpen}>
            授業情報を編集
          </Button>
          <EditUserDialog
            defaultValue={data}
            isOpen={isDialogOpen}
            close={() => {
              handleDialogClose();
              reload();
            }}
          />
          <EditUserCourseDialog
            defaultValue={data}
            isOpen={isCourseDialogOpen}
            close={() => {
              handleCourseDialogClose();
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
