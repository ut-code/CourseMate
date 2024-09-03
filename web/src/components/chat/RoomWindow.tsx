import { Box, Paper, Typography } from "@mui/material";
import { DMOverview, Message, SendMessage, UserID } from "../../common/types";
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
  const { room } = props;

  const { currentUserId, loading } = useCurrentUserId();
  const [dm, setDM] = useState<Message[] | null>(null);

  async function sendDMMessage(to: UserID, msg: SendMessage): Promise<void> {
    const message = await chat.sendDM(to, msg);

    //メッセージを送信したら、そのメッセージが追加される
    setDM((prevDM) => {
      if (prevDM !== null) {
        return [...prevDM, message];
      }
      return [message];
    });
  }

  // 初回レンダリング時にサーバーに登録し、メッセージリスナーを設定する
  useEffect(() => {
    if (!loading && currentUserId) {
      // loadingがfalseでcurrentUserIdが存在する場合のみ実行
      socket.emit("register", currentUserId);

      // メッセージ受信時のイベントリスナーを設定
      socket.on("newMessage", (message) => {
        setDM((prevDM) => {
          if (prevDM) {
            return [...prevDM, message];
          }
          return [message];
        });
      });

      // クリーンアップ関数でイベントリスナーを削除
      return () => {
        socket.off("newMessage");
      };
    }
  }, [loading, currentUserId, room.friendId]);

  async function fetchMessages(friendId: UserID) {
    const newDM = await chat.getDM(friendId);
    setDM(newDM.messages);
  }
  useEffect(() => {
    if (room) {
      fetchMessages(room.friendId);
    }
  }, [room]);

  //画面スクロール
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
            {dm.map((m) => (
              <Box
                key={m.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    m.creator === currentUserId ? "flex-end" : "flex-start",
                  marginBottom: 1,
                }}
              >
                <Paper
                  sx={{
                    display: "flex",
                    maxWidth: "60%",
                    padding: 1,
                    borderRadius: 2,
                    backgroundColor:
                      m.creator === currentUserId ? "#DCF8C6" : "#FFF",
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
