import { Box, List, ListItem, Button, Stack } from "@mui/material";
import * as chat from "../api/chat";
import { useCallback, useState } from "react";

export default function Requests() {
  const { data, error, loading, reload } = useChatPage();

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
                            .getDM(room.dmid)
                            .then((data) => alert(data.log.join("\n")));
                        } else {
                          chat
                            .getSharedRoom(room.roomId)
                            .then((data) => alert(data.log.join("\n")));
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
                          if (room.isDM) await chat.sendDM(room.dmid, msg);
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

type Hook<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  reload: () => void;
};

function useChatPage(): Hook<chat.RoomOverview[]> {
  const [data, setData] = useState<chat.RoomOverview[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const ro = await chat.entry();
      setData(ro);
      setError(null);
      setLoading(false);
    } catch (e) {
      setError(e as Error);
      setData(null);
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    reload,
  };
}
