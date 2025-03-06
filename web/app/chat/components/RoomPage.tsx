"use client";
import type { DMRoom, PersonalizedDMRoom } from "common/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import * as chat from "~/api/chat/chat";
import FullScreenCircularProgress from "~/components/common/FullScreenCircularProgress";
import { RoomWindow } from "./RoomWindow";

export default function RoomPage({ id }: { id: number }) {
  const [room, setRoom] = useState<(DMRoom & PersonalizedDMRoom) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const room = await chat.getDM(id);
        setRoom(room);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return <FullScreenCircularProgress />;
  }

  return (
    <>
      {room ? (
        <RoomWindow friendId={id} room={room} />
      ) : (
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
