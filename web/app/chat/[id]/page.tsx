"use client";
import type { DMRoom, PersonalizedDMRoom } from "common/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import * as chat from "~/api/chat/chat";
import { RoomWindow } from "~/components/chat/RoomWindow";

export default function Page({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id);
  const [room, setRoom] = useState<(DMRoom & PersonalizedDMRoom) | null>(null);
  useEffect(() => {
    (async () => {
      const room = await chat.getDM(id);
      setRoom(room);
    })();
  }, [id]);

  return (
    <>
      {room ? (
        <RoomWindow friendId={id} room={room} />
      ) : (
        // FIXME: this isn't an error when it's just loading
        <p>
          Sorry, an unexpected error has occurred.
          <Link href="/home" className="text-blue-600">
            Go Back
          </Link>
        </p>
      )}
    </>
  );
}
