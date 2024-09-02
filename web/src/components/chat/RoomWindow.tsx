import { Box, Paper, Typography } from "@mui/material";
import { DMOverview, DMRoom, SendMessage, UserID } from "../../common/types";
import { MessageInput } from "./MessageInput";
import { useCurrentUserId } from "../../hooks/useCurrentUser";
import { useState, useEffect, useRef } from "react";
import * as chat from "../../api/chat/chat";
import { RoomHeader } from "./RoomHeader";
import { socket } from "../data/socket";

type Prop = {
  room: DMOverview;
};

export function RoomWindow(props: Prop) {
  const id = useCurrentUserId();
  const { room } = props;
  const [dm, setDM] = useState<DMRoom | null>(null);

  const sendDMMessage = async (to: UserID, msg: SendMessage): Promise<void> => {
    await chat.sendDM(to, msg);
    if (room) {
      fetchMessages(room.friendId);
    }
  };

  const fetchMessages = async (friendId: UserID) => {
    const newDM = await chat.getDM(friendId);
    setDM(newDM);
  };

  // 初回レンダリング時にサーバーに登録し、メッセージリスナーを設定する
  useEffect(() => {
    socket.emit('register', id);
    console.log("私のID:",id);

    // メッセージ受信時のイベントリスナーを設定
    socket.on('newMessage', (message) => {
      console.log("メッセージゲットだぜ!: ",message)
      setDM((prevDM) => {
        if (prevDM) {
          return {
            ...prevDM,
            messages: [...prevDM.messages, message],
          };
        }
        return prevDM;
      });
    });

    // クリーンアップ関数でイベントリスナーを削除
    return () => {
      socket.off('newMessage');
    };
  }, [room.friendId]); // 依存関係を空にして初回マウント時のみ実行

  useEffect(() => {
    if (room) {
      fetchMessages(room.friendId);
    }
  }, [room]);

  const scrollDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollDiv.current) {
      const element = scrollDiv.current;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "instant",
      });
    }
  }, [dm]);

  return (
    <>
      <RoomHeader room={room} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "90%",
          padding: 2,
        }}
      >
        {dm ? (
          <Box
            sx={{ flexGrow: 1, overflowY: "auto", padding: 1 }}
            ref={scrollDiv}
          >
            {dm.messages.map((m) => (
              <Box
                key={m.id}
                sx={{
                  display: "flex",
                  justifyContent: m.creator === id ? "flex-end" : "flex-start",
                  marginBottom: 1,
                }}
              >
                <Paper
                  sx={{
                    display: "flex",
                    maxWidth: "60%",
                    padding: 1,
                    borderRadius: 2,
                    backgroundColor: m.creator === id ? "#DCF8C6" : "#FFF",
                    boxShadow: 1,
                    border: 1,
                  }}
                >
                  <Typography>{m.content}</Typography>
                </Paper>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography>最初のメッセージを送ってみましょう！</Typography>
        )}

        <MessageInput send={sendDMMessage} room={room} />
      </Box>
    </>
  );
}
