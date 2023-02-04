import React, { useState, useEffect } from "react";
import { createContext } from "react";

const ModalContext = createContext();

const ModalContextProvider = ({ children }) => {
  const [modal, setModal] = useState({
    isOpen: false,
    context: null,
    payload: null,
  });

  const isModalOpen = () => {
    return modal.isOpen
  }

  const openModal = (context) => {
    setModal({ isOpen: true, context: context, payload: null });
  };

  const openModalWithSpinner = () => {
    setModal({ isOpen: true, context: "spinner", payload: null });
  };

  const openModalWithMarkerPopupContentForm = (currentMarker) => {
    setModal({ isOpen: true, context: "markerContentForm", payload: currentMarker });
  };

  const closeModal = (delay = 0) => {
    setTimeout(() => {
      setModal({ isOpen: false, context: null, payload: null });
    }, delay);
  };

  return (
    <ModalContext.Provider
      value={{ modal, isModalOpen, openModal, closeModal, openModalWithSpinner, openModalWithMarkerPopupContentForm }}
    >
      {children}
    </ModalContext.Provider>
  );
};

const useModalContext = () => React.useContext(ModalContext);

export { ModalContextProvider, useModalContext };
