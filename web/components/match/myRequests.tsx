"use client";
import * as request from "~/api/request";
import { usePendingFromMe } from "~/api/user";
import FullScreenCircularProgress from "../common/FullScreenCircularProgress";
import { useModal } from "../common/modal/ModalProvider";
import { HumanListItem } from "../human/humanListItem";

export default function MyReq() {
  const { state, reload } = usePendingFromMe();
  const { openModal } = useModal();

  if (state.error) throw state.error;

  return (
    <div>
      <p className="p-4 text-lg">
        {state.data && state.data.length > 0
          ? "以下のリクエストを送信しました！"
          : "リクエストを送信しましょう！"}
      </p>
      {state.current === "loading" ? (
        <FullScreenCircularProgress />
      ) : (
        <ul className="mt-4 space-y-4">
          {state.data?.map((receivingUser) => (
            <HumanListItem
              key={receivingUser.id}
              id={receivingUser.id}
              name={receivingUser.name}
              pictureUrl={receivingUser.pictureUrl}
              onOpen={() => openModal(receivingUser)}
              onCancel={(id) => {
                request.cancel(id).then(reload);
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
