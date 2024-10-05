import { Box } from "@mui/material";
import { List } from "@mui/material";
import hooks from "../../api/hooks";
import * as request from "../../api/request";
import FullScreenCircularProgress from "../common/FullScreenCircularProgress";
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
        <FullScreenCircularProgress />
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
