import {
  Box,
  List,
  ListItem,
  Button,
  Stack,
  ListItemAvatar,
} from "@mui/material";
import request from "../../api/request";
import hooks from "../../api/hooks";
import UserAvatar from "../avatar/avatar";

export default function OthersReq() {
  const { data, loading, error, reload } = hooks.usePendingUsers();

  return (
    <Box>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <List>
          {data !== undefined &&
            // FIXME: this is probably not matched user
            data?.map((matchedUser) => (
              <ListItem
                key={matchedUser.id.toString()}
                secondaryAction={
                  <Stack direction={"row"}>
                    <Button
                      onClick={() => {
                        request.accept(matchedUser.id).then(() => reload());
                      }}
                    >
                      承認
                    </Button>
                    <Button
                      onClick={() => {
                        if (
                          !window.confirm(
                            "本当にこのマッチリクエストを拒否しますか?",
                          )
                        )
                          return;
                        request.reject(matchedUser.id).then(() => reload());
                      }}
                    >
                      拒否
                    </Button>
                  </Stack>
                }
              >
                <ListItemAvatar>
                  <UserAvatar
                    pictureUrl={matchedUser.pictureUrl}
                    width="50px"
                    height="50px"
                  />
                </ListItemAvatar>

                <p>{matchedUser.name}</p>
              </ListItem>
            ))}
        </List>
      )}
    </Box>
  );
}
