"use client";
import type { User } from "common/types";
import { useEffect, useState } from "react";
import { useAll } from "~/api/user";
import { useModal } from "../common/modal/ModalProvider";
import { HumanListItem } from "../human/humanListItem";

export default function UserTable({ query }: { query: string }) {
  const { openModal } = useModal();
  const {
    state: { data },
  } = useAll();

  const [users, setUsers] = useState<User[] | null>(null);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  useEffect(() => {
    function searchByUserName(query: string) {
      const filteredUsers = data?.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase()),
      );
      setUsers(filteredUsers || null);
    }
    if (query === "") {
      setUsers(data);
    }
    if (query) {
      searchByUserName(query);
    }
  }, [query, data]);

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
