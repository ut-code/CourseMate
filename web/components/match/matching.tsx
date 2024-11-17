import { deleteMatch } from "~/api/match";
import { useMatched } from "~/api/user";
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
    <div className="p-4">
      <p className="mr-10 ml-10 text-lg">
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
        <p className="text-red-500">Error: {error.message}</p>
      ) : (
        <ul className="mt-4 space-y-4">
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
        </ul>
      )}
    </div>
  );
}
