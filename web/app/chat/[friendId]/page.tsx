"use client";

import Header from "../../../components/Header";
import { RoomWindow } from "../../../components/chat/RoomWindow";
import { NavigateByAuthState } from "../../../components/common/NavigateByAuthState";

export default function Page({ params }: { params: { friendId: string } }) {
  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <Header title="チャット/Chat" />
      <p>Chat - friend Id: {params.friendId}</p>
      <RoomWindow />
    </NavigateByAuthState>
  );
}
