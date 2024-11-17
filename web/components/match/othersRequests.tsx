import request from "~/api/request";
import { usePendingToMe } from "~/api/user";
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
    <div className="p-4">
      <p className="ml-10 text-lg">
        {data && data.length > 0
          ? "以下のリクエストを受け取りました！"
          : "リクエストは受け取っていません。"}
      </p>
      {loading ? (
        <FullScreenCircularProgress />
      ) : error ? (
        <p className="text-red-500">Error: {error.message}</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {data?.map((sendingUser) => (
            <li
              key={sendingUser.id}
              className="rounded-lg bg-base-100 p-4 shadow"
            >
              <HumanListItem
                id={sendingUser.id}
                name={sendingUser.name}
                pictureUrl={sendingUser.pictureUrl}
                onOpen={() => openModal(sendingUser)}
                onAccept={() => request.accept(sendingUser.id).then(reload)}
                onReject={() => request.reject(sendingUser.id).then(reload)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
