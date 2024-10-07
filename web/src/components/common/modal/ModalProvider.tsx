import { Box } from "@mui/material";
import { styled } from "@mui/system";
import { type ReactNode, createContext, useContext, useState } from "react";
import { useMyID } from "../../../api/user";
import type { User } from "../../../common/types";
import { Card } from "../../Card";

const Overlay = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
});

type ModalContextProps = {
  openModal: (user: User) => void;
  closeModal: () => void;
};

type ModalProviderProps = {
  children: ReactNode;
};

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

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
        <Overlay onClick={closeModal}>
          <Box onClick={(e) => e.stopPropagation()}>
            <Card
              displayedUser={selectedUser}
              comparisonUserId={myId ? myId : undefined}
            />
          </Box>
        </Overlay>
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
