import React, { useState, useEffect } from "react";
import { createContext } from "react";

const ModalContext = createContext();

const ModalContextProvider = ({ children }) => {
  const [modal, setModal] = useState({
    isOpen: false,
    context: null,
    currentMarker: null,
  });

  const activateMarkerPopupContentFormModal = (currentMarker) => {
    setModal({ isOpen: true, context: "markerContentForm", currentMarker: currentMarker });
  };

  const deactivateModal = () => {
    setModal({ isOpen: false, context: null, currentMarker: null });
  };

  return (
    <ModalContext.Provider value={{ modal, setModal, deactivateModal, activateMarkerPopupContentFormModal }}>
      {children}
    </ModalContext.Provider>
  );
};

const useModalContext = () => React.useContext(ModalContext);

export { ModalContextProvider, useModalContext };
