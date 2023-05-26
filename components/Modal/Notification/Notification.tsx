import React from "react";

interface NotificationProps {
  closeModal: () => void;
  message: string;
}

const Notification = ({closeModal, message}: NotificationProps) => {
  return (
    <>
      <h1>Notification</h1>
      <p>{message}</p>
      <button onClick={() => closeModal()}>close</button>
    </>
  );
};

export default Notification;
