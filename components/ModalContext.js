import React, { useState, useEffect } from "react";
import { createContext } from "react";

const ModalContext = createContext();

const ModalContextProvider = ({ children }) => {
  const [modal, setModal] = useState({
    isOpen: false,
    context: null,
    payload: null,
  });

  const openModalWithSpinner = (text = "Wait a minute...") => {
    setModal({ isOpen: true, context: "spinner", payload: text });
  };

  const openModalWithMarkerPopupContentForm = (currentMarker) => {
    setModal({ isOpen: true, context: "markerContentForm", payload: currentMarker });
  };

  const openModalWithError = (text = "Something went wrong...") => {
    setModal({ isOpen: true, context: "error", payload: text });
  };

  const closeModal = (delay = 0) => {
    setTimeout(() => {
      setModal({ isOpen: false, context: null, payload: null });
    }, delay);
  };

  return (
    <ModalContext.Provider
      value={{
        modal,
        closeModal,
        openModalWithSpinner,
        openModalWithError,
        openModalWithMarkerPopupContentForm,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

const useModalContext = () => React.useContext(ModalContext);

export { ModalContextProvider, useModalContext };
