import Dots from "../common/Dots";
import UserAvatar from "./avatar";

type HumanListItemProps = {
  id: number;
  name: string;
  pictureUrl: string;
  lastMessage?: string;
  rollUpName?: boolean; // is currently only intended to be used in Chat
  unreadCount?: number; // only intended to be used in chat
  statusMessage?: string;
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
    lastMessage,
    rollUpName,
    unreadCount,
    statusMessage,
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
    <div
      className="flex items-center justify-between border-b p-4"
      key={id.toString()}
    >
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button
        className="flex w-full items-center text-left"
        onClick={handleOpenClick}
      >
        <div className="ml-2">
          <UserAvatar pictureUrl={pictureUrl} width="50px" height="50px" />
        </div>
        <div className="ml-4 flex flex-col justify-center">
          <span className="truncate font-medium text-base">{name}</span>
          {rollUpName && (
            <span className="max-w-[60vw] truncate text-gray-500 text-sm">
              {lastMessage}
            </span>
          )}
          {statusMessage && (
            <span className="text-blue-500 text-sm">{statusMessage}</span>
          )}
        </div>
      </button>
      <div className="flex items-center space-x-2">
        {unreadCount && (
          <span className="badge badge-primary">{unreadCount}</span>
        )}
        {onAccept && (
          // biome-ignore lint/a11y/useButtonType: <explanation>
          <button
            className="btn btn-success btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onAccept(id);
            }}
          >
            承認
          </button>
        )}
        {onReject && (
          // biome-ignore lint/a11y/useButtonType: <explanation>
          <button
            className="btn btn-error btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onReject(id);
            }}
          >
            拒否
          </button>
        )}
        {onCancel && (
          // biome-ignore lint/a11y/useButtonType: <explanation>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onCancel(id)}
          >
            キャンセル
          </button>
        )}
        {hasDots && (
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
        )}
      </div>
    </div>
  );
}
