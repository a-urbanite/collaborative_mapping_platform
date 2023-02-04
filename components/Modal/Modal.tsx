import { useModalContext } from "../ModalContext";
import styles from "./modal.module.scss";
import { Dialog } from "@headlessui/react";
import PopupContentForm from "./PopupContentForm/PopupContentForm";
import Spinner from "./Spinner/Spinner";
import { useRouter } from "next/router";

const Modal = () => {
  const { modal, closeModal } = useModalContext();
  const router = useRouter();

  return (
    <Dialog open={modal.isOpen} onClose={() => closeModal()}>
      <div className={styles.background} aria-hidden="true">
        <Dialog.Panel as="div" className={styles.content}>
          {modal.context === "spinner" && (
            <>
              <Spinner />
              <h2>{modal.payload}</h2>
            </>
          )}
          {modal.context === "error" && (
            <>
              XXX
              <h2>{modal.payload}</h2>
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
