"use client";
import { useMemo } from "react";
import { useAll, useMyID } from "~/api/user";
import { useModal } from "../common/modal/ModalProvider";
import { HumanListItem } from "../human/humanListItem";

export default function UserTable({ query }: { query: string }) {
  const { openModal } = useModal();
  const {
    state: { data },
  } = useAll();
  const { state } = useMyID();
  const initialData = useMemo(() => {
    return (
      data?.filter((item) => item.id !== state.data && item.id !== 0) ?? null
    );
  }, [data, state.data]);
  const users = query
    ? initialData?.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase()),
      )
    : initialData;

  return (
    <div>
      {users?.map((user) => (
        <HumanListItem
          key={user.id}
          id={user.id}
          name={user.name}
          pictureUrl={user.pictureUrl}
          onOpen={() => openModal(user)}
        />
      ))}
    </div>
  );
}
