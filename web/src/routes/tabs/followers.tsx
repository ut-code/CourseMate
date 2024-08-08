import { Box, Button, List, ListItem, ListItemAvatar } from "@mui/material";
import hooks from "../../api/hooks";
import { deleteMatch } from "../../api/match";
import UserAvatar from "../../components/avatar/avatar";

export default function Followers() {
  // const currentUserId = useAuthContext()?.id;

  const { data, loading, error, reload } = hooks.useMatchedUsers();

  return (
    <Box>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <List>
          {data?.map((matchedUser) => (
            <ListItem
              key={matchedUser.id.toString()}
              secondaryAction={
                <Button
                  onClick={() => {
                    if (!window.confirm("本当にこのマッチングを削除しますか?"))
                      return;
                    deleteMatch(matchedUser.id).then(() => reload());
                  }}
                >
                  削除
                </Button>
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
