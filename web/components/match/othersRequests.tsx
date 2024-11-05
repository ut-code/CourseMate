import { Box, List } from "@mui/material";
import request from "../../api/request";
import { usePendingToMe } from "../../api/user";
import FullScreenCircularProgress from "../common/FullScreenCircularProgress";
import { useModal } from "../common/modal/ModalProvider";
import { HumanListItem } from "../human/humanListItem";

export default function OthersReq() {
  const {
    state: { data, current, error },
    reload,
  } = usePendingToMe();
  const loading = current === "loading";
  const { openModal } = useModal();

  return (
    <Box>
      <p
        style={{
          marginLeft: "40px",
        }}
      >
        {data && data.length > 0
          ? "以下のリクエストを受け取りました！"
          : "リクエストは受け取っていません。"}
      </p>
      {loading ? (
        <FullScreenCircularProgress />
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <List>
          {data?.map((sendingUser) => (
            <HumanListItem
              key={sendingUser.id}
              id={sendingUser.id}
              name={sendingUser.name}
              pictureUrl={sendingUser.pictureUrl}
              onOpen={() => openModal(sendingUser)}
              onAccept={() => request.accept(sendingUser.id).then(reload)}
              onReject={() => request.reject(sendingUser.id).then(reload)}
            />
          ))}
        </List>
      )}
    </Box>
  );
}
