import { Stack, Typography, ListItem } from "@mui/material";
import { DMOverview } from "../../common/types";

type Props = {
  room: DMOverview;
};

export function DMStack(props: Props) {
  const { room } = props;
  return (
    <>
      <ListItem
        // key={room.friendId}
        sx={{
          mb: 1,
          border: "2px solid #1976D2",
          borderRadius: 1,
          padding: 5,
          cursor: "pointer",
        }}
        secondaryAction={
          <Stack
            direction={"row"}
            spacing={2}
            alignItems="center"
            textAlign={"center"}
          >
            <Typography variant="body2">{room.name}</Typography>
          </Stack>
        }
      />
    </>
  );
}
