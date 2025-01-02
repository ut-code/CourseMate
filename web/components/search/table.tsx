"use client";
import { useMemo } from "react";
import request from "~/api/request";
import { useAll, useMatched, useMyID, usePendingFromMe } from "~/api/user";
import { useModal } from "../common/modal/ModalProvider";
import { HumanListItem } from "../human/humanListItem";

export default function UserTable({ query }: { query: string }) {
  const { openModal } = useModal();
  const {
    state: { data },
  } = useAll();
  const {
    state: { data: myId },
  } = useMyID();
  const initialData = useMemo(() => {
    return data?.filter((item) => item.id !== myId && item.id !== 0) ?? null;
  }, [data, myId]);
  const users = query
    ? initialData?.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase()),
      )
    : initialData;

  const {
    state: { data: matches },
  } = useMatched();

  const {
    state: { data: pending },
  } = usePendingFromMe();

  // ユーザーがリクエストを送ってない人だけリストアップする
  const canRequest = (userId: number) =>
    !matches?.some((match) => match.id === userId) &&
    !pending?.some((pending) => pending.id === userId);

  return (
    <div>
      {users?.map((user) => (
        <HumanListItem
          key={user.id}
          id={user.id}
          name={user.name}
          pictureUrl={user.pictureUrl}
          onOpen={() => openModal(user)}
          onRequest={
            canRequest(user.id)
              ? () => {
                  request.send(user.id);
                  location.reload();
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}
