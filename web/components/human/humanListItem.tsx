import { useState } from "react";
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
  onDelete?: (id: number) => Promise<void>;
  onOpen?: (user: { id: number; name: string; pictureUrl: string }) => void;
  onAccept?: (id: number) => Promise<void>;
  onReject?: (id: number) => Promise<void>;
  onCancel?: (id: number) => Promise<void>;
  onRequest?: (id: number) => Promise<void>;
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
    onRequest,
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
      className="flex flex-row items-center border-b p-4"
      key={id.toString()}
    >
      <button type="button" onClick={handleOpenClick}>
        <div className="ml-1">
          <UserAvatar pictureUrl={pictureUrl} width="50px" height="50px" />
        </div>
      </button>
      <div className="ml-7 flex flex-col justify-center">
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
      <div className="ml-auto">
        {unreadCount ? (
          <span className="badge badge-primary">{unreadCount}</span>
        ) : undefined}
        {onAccept && (
          <ActionButton
            className="btn btn-primary btn-sm m-1"
            onClick={async () => await onAccept(id)}
          >
            承認
          </ActionButton>
        )}
        {onReject && (
          <ActionButton
            className="btn btn-sm m-1"
            onClick={async () => await onReject(id)}
          >
            拒否
          </ActionButton>
        )}
        {onCancel && (
          <ActionButton
            className="btn btn-sm m-1"
            onClick={async () => await onCancel(id)}
          >
            キャンセル
          </ActionButton>
        )}
        {onRequest && (
          <ActionButton
            className="btn btn-sm m-1 bg-primary text-white"
            onClick={async () => await onRequest(id)}
          >
            リクエスト
          </ActionButton>
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

export function ActionButton({
  onClick,
  className,
  children,
}: {
  onClick: () => Promise<void>;
  className: string;
  children: string; // change this to React.Element or something if you want to put something other than text in here
}) {
  const [inProgress, setInProgress] = useState<boolean>(false);
  return inProgress ? (
    <button type="button" className={className} disabled>
      <span className="loading loading-spinner" />
    </button>
  ) : (
    <button
      type="button"
      className={className}
      onClick={async (e) => {
        e.stopPropagation();
        setInProgress(true);
        await onClick();
      }}
    >
      {children}
    </button>
  );
}
