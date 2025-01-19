"use client";
import type { UserID, UserWithCoursesAndSubjects } from "common/types";
import request from "~/api/request";
import { useModal } from "~/components/common/modal/ModalProvider";
import { HumanListItem } from "../human/humanListItem";

export default function UserTable({
  users,
  canRequest,
}: {
  users: UserWithCoursesAndSubjects[];
  canRequest: (id: UserID) => boolean;
}) {
  const { openModal } = useModal();

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
