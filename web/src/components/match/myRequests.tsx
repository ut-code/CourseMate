import { Box, CircularProgress } from "@mui/material";
import { List } from "@mui/material";
import hooks from "../../api/hooks";
import { useModal } from "../common/modal/ModalProvider";
import { HumanListItem } from "../human/humanListItem";

export default function MyReq() {
  const { data, loading, error } = hooks.usePendingRequestsFromMe();
  const { openModal } = useModal();

  return (
    <Box>
      <p
        style={{
          marginLeft: "40px",
        }}
      >
        {data && data.length > 0
          ? "以下のリクエストを送信しました！"
          : "リクエストを送信しましょう！"}
      </p>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <List>
          {data?.map((receivingUser) => (
            <HumanListItem
              key={receivingUser.id}
              id={receivingUser.id}
              name={receivingUser.name}
              pictureUrl={receivingUser.pictureUrl}
              onOpen={() => openModal(receivingUser)}
            />
          ))}
        </List>
      )}
    </Box>
  );
}
