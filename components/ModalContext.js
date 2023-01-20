import React, { useState, useEffect } from "react";
import { createContext } from "react";

const ModalContext = createContext();

const ModalContextProvider = ({ children }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return <ModalContext.Provider value={{ modalOpen, setModalOpen }}>{children}</ModalContext.Provider>;
};

const useModalContext = () => React.useContext(ModalContext);

export { ModalContextProvider, useModalContext };
