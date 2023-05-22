import React from 'react';
import Modal2 from './Modal2';

interface ModalContextValue {
  modalRef: React.RefObject<any>;
}

interface ModalProviderProps {
  children: React.ReactNode;
}

const ModalContext = React.createContext<ModalContextValue | null>(null);

function ModalProvider({ children }: ModalProviderProps) {
  const modalRef = React.useRef<any>(null);

  const contextValue: ModalContextValue = {
    modalRef,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      <Modal2 ref={modalRef} />
    </ModalContext.Provider>
  );
}

function useModal2() {
  const context = React.useContext(ModalContext);

  if (!context) {
    throw new Error('useModal2 must be used within a ModalProvider');
  }

  const { modalRef } = context;

  return {
    openModal: async (context: string) => {
      if (modalRef.current) {
        return await modalRef.current.openModal(context);
      }
    },
  };
}

export { ModalProvider, useModal2 };
