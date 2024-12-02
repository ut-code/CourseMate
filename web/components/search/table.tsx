"use client";
import type { User } from "common/types";
import { useEffect, useMemo, useState } from "react";
import { useAll, useMyID } from "~/api/user";
import { useModal } from "../common/modal/ModalProvider";
import { HumanListItem } from "../human/humanListItem";

export default function UserTable({ query }: { query: string }) {
  const { openModal } = useModal();
  const {
    state: { data },
  } = useAll();
  const { state } = useMyID();
  const [users, setUsers] = useState<User[] | null>(null);

  const filteredData = useMemo(() => {
    return (
      data?.filter((item) => item.id !== state.data && item.id !== 0) ?? null
    );
  }, [data, state.data]);

  useEffect(() => {
    function searchByUserName(query: string) {
      const filteredUsers = filteredData?.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase()),
      );
      setUsers(filteredUsers || null);
    }
    if (!query) {
      setUsers(filteredData);
    } else {
      searchByUserName(query);
    }
  }, [query, filteredData]);

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
