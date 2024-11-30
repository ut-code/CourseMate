"use client";
import { useEffect, useState } from "react";
import * as chat from "~/api/chat/chat";
import { RoomWindow } from "~/components/chat/RoomWindow";

export default function Page({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id);
  const [room, setRoom] = useState<
    | ({
        id: number;
        isDM: true;
        messages: {
          id: number;
          creator: number;
          createdAt: Date;
          content: string;
          edited: boolean;
        }[];
      } & {
        name: string;
        thumbnail: string;
      })
    | null
  >(null);
  useEffect(() => {
    (async () => {
      const room = await chat.getDM(id);
      setRoom(room);
    })();
  }, [id]);

  return (
    <>
      <p>idは{id}です。</p>
      {room ? <RoomWindow friendId={id} room={room} /> : <p>データないよ</p>}
    </>
  );
}
