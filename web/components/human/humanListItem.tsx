import UserAvatar from "./avatar";

import Dots from "../common/Dots";

type HumanListItemProps = {
  id: number;
  name: string;
  pictureUrl: string;
  lastMessage?: string;
  rollUpName?: boolean; // is currently only intended to be used in Chat
  onDelete?: (id: number) => void;
  onOpen?: (user: { id: number; name: string; pictureUrl: string }) => void;
  onAccept?: (id: number) => void;
  onReject?: (id: number) => void;
  onCancel?: (id: number) => void;
  hasDots?: boolean;
  dotsActions?: object;
};

export function HumanListItem(props: HumanListItemProps) {
  const {
    id,
    name,
    pictureUrl,
    rollUpName,
    lastMessage,
    onDelete,
    onOpen,
    onAccept,
    onReject,
    onCancel,
    hasDots,
  } = props;
  const handleDeleteClick = () => {
    if (!onDelete) return;
    onDelete(id);
  };
  const handleOpenClick = () => {
    if (!onOpen) return;
    onOpen({ id, name, pictureUrl });
  };

  return (
    <li key={id.toString()}>
      <button type="button" onClick={handleOpenClick} className="btn cm-li-btn">
        <div className="flex flex-1 gap-6">
          <UserAvatar pictureUrl={pictureUrl} width="50px" height="50px" />
          <div className="flex flex-1 flex-col justify-center">
            <p className="whitespace-nowrap text-left text-lg">{name}</p>
            {rollUpName && (
              <p className="min-h-[1rem] max-w-[60vw] whitespace-nowrap text-left text-gray-500 text-sm">
                {lastMessage}
              </p>
            )}
          </div>
        </div>
        <ActionMenu
          onAccept={onAccept}
          onReject={onReject}
          onCancel={onCancel}
          id={id}
        />
      </button>

      {/* TODO: button の中に移す */}
      {hasDots && (
        <div className="absolute top-[50%] right-4 translate-y-[-50%]">
          <Dots
            actions={[
              {
                label: "詳細",
                onClick: handleOpenClick,
                alert: false,
              },
              {
                label: "削除",
                color: "red",
                onClick: handleDeleteClick,
                alert: true,
                messages: {
                  buttonMessage: "削除",
                  AlertMessage: "このフレンドを削除しますか？",
                  subAlertMessage: "この操作は取り消せません。",
                  yesMessage: "削除",
                },
              },
            ]}
          />
        </div>
      )}
    </li>
  );
}

function ActionMenu({
  onAccept,
  onReject,
  onCancel,
  id,
}: {
  onAccept?: (id: number) => void;
  onReject?: (id: number) => void;
  onCancel?: (id: number) => void;
  id: number;
}) {
  return (
    <div className="flex items-center gap-2">
      {onAccept && (
        <button
          type="button"
          onClick={() => onAccept(id)}
          className="btn btn-sm btn-primary"
        >
          承認
        </button>
      )}
      {onReject && (
        <button
          type="button"
          onClick={() => onReject(id)}
          className="btn btn-sm btn-outline btn-primary"
        >
          拒否
        </button>
      )}
      {onCancel && (
        <button
          type="button"
          onClick={() => onCancel(id)}
          className="btn btn-sm btn-outline btn-primary"
        >
          キャンセル
        </button>
      )}
    </div>
  );
}
