import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { User } from "../../../../common/types";
import useData from "../../hooks/useData";

async function deleteMatch(senderId: number, receiverId: number) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/matches/${senderId}/${receiverId}`,
      {
        method: "DELETE",
      },
    );
    const data = await response.json();
    return data;
  } catch {
    console.error();
  }
}

export default function Followers() {
  // const currentUserId = useAuthContext()?.id;
  const currentUserId = 1; // TODO: Fix this

  const url = `${import.meta.env.VITE_API_ENDPOINT}/requests/matched/${currentUserId}`;

  const { data, isLoading, error, fetchData } = useData<User[]>(url);

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
                    deleteMatch(currentUserId!, matchedUser.id).then(() =>
                      fetchData(),
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
