import * as React from "react";
// import { createContext } from "react";

const ModalContext = React.createContext();

const ModalContextProvider = ({ children }) => {
  const [modal, setModal] = React.useState({
    isOpen: false,
    context: null,
    payload: null,
  });
  const [userName, setUserName] = React.useState("anon")

  const openModalWithSpinner = (text = "Wait a minute...") => {
    setModal({ isOpen: true, context: "spinner", payload: text });
  };

  const openModalWithMarkerPopupContentForm = (currentMarker) => {
    setModal({ isOpen: true, context: "markerContentForm", payload: currentMarker });
  };

  const openModalWithError = (text = "Something went wrong...") => {
    setModal({ isOpen: true, context: "error", payload: text });
  };

  const openModalWithNameForm = (currentMarker) => {
    setModal({ isOpen: true, context: "nameForm", payload: currentMarker });
  }

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
        openModalWithNameForm,
        userName, setUserName
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

const useModalContext = () => React.useContext(ModalContext);

export { ModalContextProvider, useModalContext };
