import { Box, List, ListItem, Button, Stack } from "@mui/material";
import * as chat from "../../api/chat/chat";
import { useRoomsOverview } from "../../api/chat/hooks";

export default function Chat() {
  const { data, error, loading, reload } = useRoomsOverview();

  let key = 0;
  return (
    <Box>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <List>
          {data !== undefined &&
            data?.map((room) => (
              <ListItem
                key={key++}
                secondaryAction={
                  <Stack direction={"row"}>
                    <Button
                      onClick={() => {
                        if (room.isDM) {
                          chat
                            .getDM(room.friendId)
                            .then((data) => alert(data.messages.join("\n")));
                        } else {
                          chat
                            .getSharedRoom(room.roomId)
                            .then((data) => alert(data.messages.join("\n")));
                        }
                      }}
                    >
                      チャットの内容を表示
                    </Button>
                    <form>
                      メッセージを送信する
                      <input placeholder="メッセージ" id={"message-" + key} />
                      <button
                        onClick={async () => {
                          const elem = document.getElementById(
                            "message-" + key,
                          )! as HTMLInputElement;
                          const text = elem.value!;
                          const msg = { content: text };
                          if (room.isDM) await chat.sendDM(room.friendId, msg);
                          else await chat.send(room.roomId, msg);
                          reload();
                        }}
                      >
                        送信する
                      </button>
                    </form>
                  </Stack>
                }
              ></ListItem>
            ))}
        </List>
      )}
    </Box>
  );
}
