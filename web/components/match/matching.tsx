"use client";
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
      {data && data.length === 0 && (
        <p className="mr-10 ml-10 text-lg">
          誰ともマッチングしていません。 リクエストを送りましょう！
        </p>
      )}
      {current === "loading" ? (
        <FullScreenCircularProgress />
      ) : error ? (
        <p className="text-red-500">Error: {error.message}</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {data?.map((matchedUser) =>
            matchedUser.id === 0 ? (
              //メモ帳
              <div key={0} />
            ) : (
              <HumanListItem
                key={matchedUser.id}
                id={matchedUser.id}
                name={matchedUser.name}
                pictureUrl={matchedUser.pictureUrl}
                onOpen={() => openModal(matchedUser)}
                onDelete={() =>
                  deleteMatch(matchedUser.id).then(() => reload())
                }
                hasDots
              />
            ),
          )}
        </ul>
      )}
    </div>
  );
}
