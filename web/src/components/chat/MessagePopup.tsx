import { Box, Button } from "@mui/material";

export default function MessagePopup({
  handleEdit,
  handleDelete,
}: {
  handleEdit: () => void;
  handleDelete: () => void;
}) {
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
          handleEdit();
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
