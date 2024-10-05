import { Box, List } from "@mui/material";
import { deleteMatch } from "../../api/match";
import { useMatched } from "../../api/user";
import FullScreenCircularProgress from "../common/FullScreenCircularProgress";
import { useModal } from "../common/modal/ModalProvider";
import { HumanListItem } from "../human/humanListItem";

export default function Matchings() {
  const {
    state: { data, current, error },
    reload,
  } = useMatched();
  const { openModal } = useModal();

  return (
    <Box>
      <p
        style={{
          marginLeft: "40px",
          marginRight: "40px",
        }}
      >
        {data && data.length === 0 && (
          <>
            誰ともマッチングしていません。
            <br />
            リクエストを送りましょう！
          </>
        )}
      </p>
      {current === "loading" ? (
        <FullScreenCircularProgress />
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <List>
          {data?.map((matchedUser) => (
            <HumanListItem
              key={matchedUser.id}
              id={matchedUser.id}
              name={matchedUser.name}
              pictureUrl={matchedUser.pictureUrl}
              onOpen={() => openModal(matchedUser)}
              onDelete={() => deleteMatch(matchedUser.id).then(() => reload())}
              hasDots
            />
          ))}
        </List>
      )}
    </Box>
  );
}
