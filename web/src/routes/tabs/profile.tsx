import { Box, Button } from "@mui/material";
import LogOutButton from "../../components/LogOutButton";
import { useState } from "react";
import EditUserDialog from "../../components/EditUserDialog";
import hooks from "../../api/hooks";

export default function Profile() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data, isLoading, error } = hooks.useMe();

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <Box>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : data ? (
        <>
          <Box>
            <p>Name: {data.name}</p>
            <p>ID: {data.id}</p>
            {data.pictureUrl && (
              <img
                src={data.pictureUrl}
                alt="Profile Picture"
                style={{ width: "300px", height: "300px", objectFit: "cover" }}
              />
            )}
          </Box>
          <LogOutButton />
          <Button color="inherit" onClick={handleDialogOpen}>
            プロフィールを編集
          </Button>
          <EditUserDialog
            userId={data.id}
            open={isDialogOpen}
            onClose={handleDialogClose}
          />
        </>
      ) : (
        <p>データがありません。</p>
      )}
    </Box>
  );
}
