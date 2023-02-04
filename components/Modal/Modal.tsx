import { useModalContext } from "../ModalContext";
import styles from "./modal.module.scss";
import { Dialog } from "@headlessui/react";
import PopupContentForm from "./PopupContentForm/PopupContentForm";
import LoadingSpin from "react-loading-spin";
import { useRouter } from "next/router";
import { RxCross1 } from "react-icons/rx";

const Modal = () => {
  const { modal, closeModal } = useModalContext();
  const router = useRouter();

  return (
    <Dialog open={modal.isOpen} onClose={() => closeModal()}>
      <div className={styles.background} aria-hidden="true">
        <Dialog.Panel as="div" className={styles.content}>
          {modal.context === "spinner" && (
            <>
              <Dialog.Title>Loading...</Dialog.Title>
              <LoadingSpin/>
              <Dialog.Description>{modal.payload}</Dialog.Description>
            </>
          )}
          {modal.context === "error" && (
            <>
              <Dialog.Title>Error</Dialog.Title>
              <RxCross1/>
              <Dialog.Description>{modal.payload}</Dialog.Description>
              <button onClick={() => router.reload()}>Reload Page</button>
            </>
          )}
          {modal.context === "markerContentForm" && (
            <>
              <Dialog.Title>Tell us your story</Dialog.Title>
              <Dialog.Description>
                Here you can enter text and images that tell your spatial story
              </Dialog.Description>
              <PopupContentForm marker={modal.payload} />
              <button onClick={() => closeModal()}>Cancel</button>
            </>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Modal;
