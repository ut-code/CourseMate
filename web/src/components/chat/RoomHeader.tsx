import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import type { DMOverview } from "../../common/types";
import UserAvatar from "../human/avatar";
type Props = {
  room: DMOverview;
};

export function RoomHeader(props: Props) {
  const { room } = props;
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <Button
        variant="text"
        sx={{ color: "black", padding: "0px", margin: "0px", minWidth: "0px" }}
        onClick={() => {
          navigate({ to: "/chat" });
        }}
      >
        <ArrowBackIcon />
      </Button>
      <Box sx={{ marginLeft: "16px", alignItems: "center", display: "flex" }}>
        <UserAvatar pictureUrl={room.thumbnail} width="30px" height="30px" />
      </Box>
      <Box sx={{ marginLeft: "16px" }}>
        <Typography variant="h6">{room.name}</Typography>
      </Box>
    </Box>
  );
}
