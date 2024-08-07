import { Typography, ListItem, Stack } from "@mui/material";
import { DMOverview } from "../../common/types";
import UserAvatar from "../avatar/avatar";

type Props = {
  room: DMOverview;
};

export function DMStack(props: Props) {
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
          <UserAvatar
            pictureUrl={room.thumbnail}
            altText={room.name}
            width="50px"
            height="50px"
          />
          <Typography variant="body2">{room.name}</Typography>
        </Stack>
      </ListItem>
    </>
  );
}
