import { Typography, ListItem } from "@mui/material";
import { DMOverview } from "../../common/types";

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
          padding: 5,
          cursor: "pointer",
        }}
        secondaryAction={<Typography variant="body2">{room.name}</Typography>}
      />
    </>
  );
}
