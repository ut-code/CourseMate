import { Box, Typography } from "@mui/material";
import UserAvatar from "../human/avatar";
import { DMOverview } from "../../common/types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
      }}
    >
      <ArrowBackIcon
        onClick={() => {
          setActiveRoom(null);
        }}
      />
      <Box sx={{ marginLeft: "16px", alignItems: "center", display: "flex" }}>
        <UserAvatar pictureUrl={room.thumbnail} width="30px" height="30px" />
      </Box>
      <Box sx={{ marginLeft: "16px" }}>
        <Typography variant="h6">{room.name}</Typography>
      </Box>
    </Box>
  );
}
