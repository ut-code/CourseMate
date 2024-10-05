import { Box } from "@mui/material";
import { List } from "@mui/material";
import { usePendingFromMe } from "../../api/user";
import * as request from "../../api/request";
import FullScreenCircularProgress from "../common/FullScreenCircularProgress";
import { useModal } from "../common/modal/ModalProvider";
import { HumanListItem } from "../human/humanListItem";

export default function MyReq() {
  const { state } = usePendingFromMe();
  const { openModal } = useModal();

  return (
    <Box>
      <p
        style={{
          marginLeft: "40px",
        }}
      >
        {state.data && state.data.length > 0
          ? "以下のリクエストを送信しました！"
          : "リクエストを送信しましょう！"}
      </p>
      {state.current === "loading" ? (
        <FullScreenCircularProgress />
      ) : state.error ? (
        <p>Error: {state.error.message}</p>
      ) : (
        <List>
          {state.data?.map((receivingUser) => (
            <HumanListItem
              key={receivingUser.id}
              id={receivingUser.id}
              name={receivingUser.name}
              pictureUrl={receivingUser.pictureUrl}
              onOpen={() => openModal(receivingUser)}
              onCancel={(id) => {
                request.cancel(id);
              }}
            />
          ))}
        </List>
      )}
    </Box>
  );
}
