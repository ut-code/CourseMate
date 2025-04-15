"use client";
import { deleteMatch } from "~/api/match";
import { useMatched } from "~/api/user";
import BackgroundText from "../common/BackgroundText";
import FullScreenCircularProgress from "../common/FullScreenCircularProgress";
import { useModal } from "../common/modal/ModalProvider";
import { HumanListItem } from "../human/humanListItem";

export default function Matchings() {
  const {
    state: { data, current, error },
    reload,
  } = useMatched();
  const { openModal } = useModal();

  if (error) throw error;

  return (
    <div className="h-full">
      {data && data.length === 0 && (
        <BackgroundText text="まだ誰ともマッチングしていません。リクエストを送りましょう！" />
      )}
      {current === "loading" ? (
        <FullScreenCircularProgress />
      ) : (
        <ul className="space-y-4">
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
