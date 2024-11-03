"use client";

import { RoomWindow } from "../../../components/chat/RoomWindow";
import { NavigateByAuthState } from "../../../components/common/NavigateByAuthState";

export default function Page({ params }: { params: { friendId: string } }) {
  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <h1>Chat - friend Id: {params.friendId}</h1>
      <RoomWindow />
    </NavigateByAuthState>
  );
}
