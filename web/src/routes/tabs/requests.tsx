import { Box, List, ListItem, Button, ListItemAvatar, Avatar, Stack } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { User } from "../../../../common/types";
import useData from "../../hooks/useData";
import request from "../../api/request";
import endpoints from "../../api/endpoints";

export default function Requests() {
  // const currentUserId = useAuthContext()?.id;
  const currentUserId = 1; // TODO: Fix this

  const url = endpoints.requests(currentUserId);

  const { data, isLoading, error, fetchData } = useData<User[]>(url);

  return (
    <Box>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <List>
          {data !== undefined &&
            data?.map((matchedUser) => (
              <ListItem
                key={matchedUser.id.toString()}
                secondaryAction={
                  <Stack direction={"row"}>
                    <Button
                      onClick={() => {
                        request.accept(matchedUser.id, currentUserId!).then(() => fetchData());
                      }}
                    >
                      受け入れ
                    </Button>
                    <Button
                      onClick={() => {
                        if (!window.confirm("本当にこのマッチリクエストを拒否しますか?")) return;
                        request.reject(matchedUser.id, currentUserId!).then(() => fetchData());
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
