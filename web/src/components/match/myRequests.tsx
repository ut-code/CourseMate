import { Box } from "@mui/material";
import hooks from "../../api/hooks";
import UserAvatar from "../avatar/avatar";
import { List, ListItem, ListItemAvatar } from "@mui/material";
export default function MyReq() {
  const { data, loading, error } = hooks.usePendingRequestByUser();
  return (
    <Box>
      <p>送信済みリクエスト</p>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <List>
          {data !== undefined &&
            data?.map((receivingUser) => (
              <ListItem key={receivingUser.id.toString()}>
                <ListItemAvatar>
                  <UserAvatar
                    pictureUrl={receivingUser.pictureUrl}
                    width="50px"
                    height="50px"
                  />
                </ListItemAvatar>
                <p>{receivingUser.name}</p>
              </ListItem>
            ))}
        </List>
      )}
    </Box>
  );
}
