import {
  Box,
  List,
  ListItem,
  Button,
  ListItemAvatar,
  Avatar,
  Stack,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import request from "../../api/request";
import hooks from "../../api/hooks";

export default function Requests() {
  // const currentUserId = useAuthContext()?.id;

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
                      受け入れ
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
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <p>{matchedUser.name}</p>
              </ListItem>
            ))}
        </List>
      )}
    </Box>
  );
}
