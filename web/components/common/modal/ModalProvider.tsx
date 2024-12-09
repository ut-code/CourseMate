import type { User } from "common/types";
import { type ReactNode, createContext, useContext, useState } from "react";
import { useMyID } from "~/api/user";
import { Card } from "../../Card";

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

type ModalContextProps = {
  openModal: (user: User) => void;
  closeModal: () => void;
};

type ModalProviderProps = {
  children: ReactNode;
};

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const {
    state: { data: myId },
  } = useMyID();

  const openModal = (user: User) => {
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
      {open && selectedUser && (
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
            <Card
              displayedUser={selectedUser}
              comparisonUserId={myId ? myId : undefined}
            />
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
