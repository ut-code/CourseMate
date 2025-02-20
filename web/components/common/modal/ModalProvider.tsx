"use client";
import type { UserWithCoursesAndSubjects } from "common/types";
import { type ReactNode, createContext, useContext, useState } from "react";
import { useAboutMe } from "~/api/user";
import { Card } from "../../Card";

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

type ModalContextProps = {
  openModal: (user: UserWithCoursesAndSubjects) => void;
  closeModal: () => void;
};

type ModalProviderProps = {
  children: ReactNode;
};

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] =
    useState<UserWithCoursesAndSubjects | null>(null);
  const {
    state: { data: currentUser },
  } = useAboutMe();

  const openModal = (user: UserWithCoursesAndSubjects) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {open && selectedUser && currentUser && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div
            className="rounded bg-white p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Card displayedUser={selectedUser} currentUser={currentUser} />
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
