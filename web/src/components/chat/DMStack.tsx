import { Stack, Typography, ListItem } from "@mui/material";
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
          mb: 1,
          border: "2px solid #1976D2",
          borderRadius: 1,
          cursor: "pointer",
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
