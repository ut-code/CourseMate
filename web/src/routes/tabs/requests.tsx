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
import { User } from "../../../../common/types";
import useData from "../../hooks/useData";

async function rejectMatchRequest(senderId: number, receiverId: number) {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_ENDPOINT
      }/requests/reject/${senderId.toString()}/${receiverId.toString()}`,
      {
        method: "PUT",
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function acceptMatchRequest(senderId: number, receiverId: number) {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_ENDPOINT
      }/requests/accept/${senderId.toString()}/${receiverId.toString()}`,
      {
        method: "PUT",
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export default function Requests() {
  // const currentUserId = useAuthContext()?.id;
  const currentUserId = 1; // TODO: Fix this

  const url = `${import.meta.env.VITE_API_ENDPOINT}/requests/receiverId/${currentUserId}`;

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
                        acceptMatchRequest(matchedUser.id, currentUserId!).then(
                          () => fetchData(),
                        );
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
                        rejectMatchRequest(matchedUser.id, currentUserId!).then(
                          () => fetchData(),
                        );
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
