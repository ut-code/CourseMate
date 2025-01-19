"use client";
import { useMemo, useState } from "react";
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

  // リクエストを送ってない人のみリクエスト送信可能
  // FIXME: O(n^2) | n = count(users) なのでめっちゃ計算コストかかる。なんとかして。
  const canRequest = (userId: number) =>
    !matches?.some((match) => match.id === userId) &&
    !pending?.some((pending) => pending.id === userId);

  const [searchQuery__interest, setSearchQuery__interest] = useState<
    string | null
  >(null);
  setSearchQuery__interest; // TODO: use this in some UI

  const filteredUsers = users
    // this is O(count(users) * count(avg(count(interests))) * count(avg(len(interests.name)))). very bad.
    ?.filter(
      (u) =>
        searchQuery__interest === null ||
        u.interestSubjects.some((i) => i.name.includes(searchQuery__interest)),
    );
  console.log(searchQuery__interest);

  return (
    <div>
      {filteredUsers?.map((user) => (
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
