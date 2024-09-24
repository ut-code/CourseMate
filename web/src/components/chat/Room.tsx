import { ListItem, Stack, Typography } from "@mui/material";
import type { DMOverview } from "../../common/types";
import UserAvatar from "../human/avatar";

type Props = {
  room: DMOverview;
};

export function Room(props: Props) {
  const { room } = props;
  return (
    <>
      <ListItem
        sx={{
          border: "1px solid gray",
          borderRadius: 1,
          cursor: "pointer",
          "&:hover": {
            background: "gainsboro",
          },
        }}
      >
        <Stack
          direction={"row"}
          spacing={2}
          alignItems="center"
          textAlign={"center"}
        >
          <UserAvatar pictureUrl={room.thumbnail} width="50px" height="50px" />
          <Typography variant="body2">{room.name}</Typography>
          <Typography variant="subtitle1">{room.lastMsg?.content}</Typography>
        </Stack>
      </ListItem>
    </>
  );
}
