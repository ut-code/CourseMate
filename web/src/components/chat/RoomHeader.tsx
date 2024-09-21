import { Box, Typography } from "@mui/material";
import type { DMOverview } from "../../common/types";
import UserAvatar from "../avatar/avatar";
type Props = { room: DMOverview };

export function RoomHeader(props: Props) {
  const { room } = props;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "0.5rem",
        borderBottom: "1px solid #ddd",
      }}
    >
      <UserAvatar pictureUrl={room.thumbnail} width="50px" height="50px" />
      <Typography variant="h6">{room.name}</Typography>
    </Box>
  );
}
