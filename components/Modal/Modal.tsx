import { useModalContext } from "../ModalContext";
import styles from "./modal.module.scss";
import { Dialog } from "@headlessui/react";
import PopupContentForm from "./PopupContentForm/PopupContentForm";
import Spinner from "./Spinner/Spinner";

const Modal = () => {
  const { modal, closeModal } = useModalContext();

  return (
    <Dialog open={modal.isOpen} onClose={() => closeModal()}>
      <div className={styles.background} aria-hidden="true">
        <Dialog.Panel as="div" className={styles.content}>
          {modal.context === "spinner" && <Spinner />}
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
