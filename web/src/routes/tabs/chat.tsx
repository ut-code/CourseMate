import { Box, List, Typography } from "@mui/material";
import { useRoomsOverview } from "../../api/chat/hooks";
import { DMOverview } from "../../common/types";
import { DMStack } from "../../components/chat/DMStack";
import { useState } from "react";
import { MessageWindow } from "../../components/chat/MessageWindow";

export default function Chat() {
  const {
    data: roomsData,
    error: roomsError,
    loading: roomsLoading,
  } = useRoomsOverview();
  const [activeRoom, setActiveRoom] = useState<DMOverview | null>(null);

  const handleRoomClick = (room: DMOverview) => {
    setActiveRoom(room);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "90vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "25%",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
        }}
      >
        {roomsLoading ? (
          <Typography>Loading...</Typography>
        ) : roomsError ? (
          <Typography color="error">Error: {roomsError.message}</Typography>
        ) : (
          <List disablePadding>
            {roomsData?.map((room) => {
              if (room.isDM) {
                return (
                  <Box
                    key={room.friendId}
                    onClick={() => handleRoomClick(room)}
                    sx={{
                      backgroundColor:
                        activeRoom?.friendId === room.friendId
                          ? "gainsboro"
                          : "white",
                    }}
                  >
                    <DMStack room={room} />
                  </Box>
                );
              } else {
                return (
                  <Typography key={room.roomId} variant="body2" sx={{ mb: 1 }}>
                    グループチャット: {room.name}
                  </Typography>
                );
              }
            })}
          </List>
        )}
      </Box>
      <Box
        sx={{
          width: "75%",
          height: "100%",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        {activeRoom ? (
          <MessageWindow room={activeRoom} />
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              textAlign: "center",
            }}
          >
            チャットを始めよう！
          </div>
        )}
      </Box>
    </Box>
  );
}
