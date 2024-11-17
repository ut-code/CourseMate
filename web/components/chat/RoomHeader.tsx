import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import type { DMOverview } from "~/common/types";
import UserAvatar from "../human/avatar";

type Props = {
  room: DMOverview;
};

export function RoomHeader(props: Props) {
  const { room } = props;
  return (
    <div className="flex items-center p-4">
      <Link href="/chat" passHref>
        <div className="m-0 flex items-center p-0 text-black">
          <MdArrowBack size={24} />
        </div>
      </Link>

      <div className="ml-4 flex items-center">
        <UserAvatar pictureUrl={room.thumbnail} width="30px" height="30px" />
      </div>

      <div className="ml-4">
        <h6 className="font-semibold text-lg">{room.name}</h6>
      </div>
    </div>
  );
}
