import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import hooks from "../../api/hooks";
import { deleteMatch } from "../../api/match";

export default function Followers() {
  // const currentUserId = useAuthContext()?.id;

  const { data, isLoading, error, reload } = hooks.useMatchedUsers();

  return (
    <Box>
      {isLoading ? (
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
                    deleteMatch(matchedUser.id).then(() =>
                      reload(),
                    );
                  }}
                >
                  削除
                </Button>
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
