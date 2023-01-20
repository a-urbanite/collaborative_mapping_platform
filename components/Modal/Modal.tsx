import React, { useEffect } from "react";
import { useModalContext } from "../ModalContext";
import styles from "./modal.module.scss";
import { useState } from "react";
import { Dialog } from "@headlessui/react";

const Modal = () => {
  const { modalOpen, setModalOpen } = useModalContext();

  return (

    <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
      <div className={styles.background} aria-hidden="true">
        <Dialog.Panel as="div" className={styles.content}>
          <Dialog.Title>Tell us your story</Dialog.Title>
          <Dialog.Description>Here you can enter text and images that tell your spatial story</Dialog.Description>

          <form className={styles.form}>
            <input></input>
            <textarea></textarea>
          </form>

          <button onClick={() => setModalOpen(false)}>Cancel</button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Modal;
