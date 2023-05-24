import React from "react";
import Modal from "./Modal";

interface ModalContextValue {
  modalRef: React.RefObject<any>;
}

interface ModalProviderProps {
  children: React.ReactNode;
}

const ModalContext = React.createContext<ModalContextValue | null>(null);

function ModalProvider({ children }: ModalProviderProps) {
  const modalRef = React.useRef<any>(null);

  return (
    <ModalContext.Provider
      value={{
        modalRef,
      }}
    >
      {children}
      <Modal ref={modalRef} />
    </ModalContext.Provider>
  );
}

function useModal() {
  const context = React.useContext(ModalContext);

  if (!context) {
    throw new Error("useModal2 must be used within a ModalProvider");
  }

  const { modalRef } = context;

  return {
    openModalWithNameForm: async () => {
      if (modalRef.current) {
        return await modalRef.current.openModal("userNameForm");
      }
    },

    openModalWithSpinner: async (message: string = "") => {
      if (modalRef.current) {
        return await modalRef.current.openModal("spinner", message);
      }
    },

    openModalWithError: async (message: string = "") => {
      if (modalRef.current) {
        return await modalRef.current.openModal("error", message);
      }
    },

    openModalWithPopupContentForm: async (marker: any) => {
      if (modalRef.current) {
        return await modalRef.current.openModal("popupContentForm", "", marker);
      }
    },

    closeModal: async (delay: number = 0) => {
      if (modalRef.current) {
        await modalRef.current.closeModal(delay);
      }
    },
  };
}

export { ModalProvider, useModal };
