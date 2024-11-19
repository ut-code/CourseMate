import type { DMOverview } from "common/types";
import UserAvatar from "../human/avatar";

type Props = {
  room: DMOverview;
};

export function Room(props: Props) {
  const { room } = props;
  return (
    <div className="cursor-pointer rounded-md border border-gray-300 p-3 hover:bg-gray-200">
      <div className="flex items-center space-x-4">
        <UserAvatar pictureUrl={room.thumbnail} width="50px" height="50px" />
        <div className="text-center">
          <p className="font-medium text-sm">{room.name}</p>
          <p className="text-gray-500 text-xs">{room.lastMsg?.content}</p>
        </div>
      </div>
    </div>
  );
}
