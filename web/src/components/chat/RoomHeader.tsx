import { Box, Button, Typography } from "@mui/material";
import UserAvatar from "../human/avatar";
import { DMOverview } from "../../common/types";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
type Props = {
  room: DMOverview;
  setActiveRoom: (room: DMOverview | null) => void;
};

export function RoomHeader(props: Props) {
  const { room, setActiveRoom } = props;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "0.5rem",
        borderBottom: "1px solid #ddd",
      }}
    >
      <Button
        onClick={() => {setActiveRoom(null)}}
      >
        <ArrowBackIcon />
      </Button>
      <UserAvatar pictureUrl={room.thumbnail} width="50px" height="50px" />
      <Typography variant="h6">{room.name}</Typography>
    </Box>
  );
}
