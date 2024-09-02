import { deleteMessage } from "../../api/chat/chat";
import { Message } from "../../common/types";
import { Box, Button } from "@mui/material";

export default function MessagePopup({
  message,
  reload,
  edit,
}: {
  message: Message;
  reload: () => void;
  edit: () => void;
}) {
  const handleDelete = async () => {
    await deleteMessage(message.id);
    reload();
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        padding: 1,
        borderRadius: 2,
      }}
    >
      <Button
        onClick={async () => {
          edit();
        }}
      >
        update
      </Button>
      <Button
        onClick={() => {
          window.confirm("メッセージを消去しますか？") && handleDelete();
        }}
      >
        delete
      </Button>
    </Box>
  );
}
