import { useModalContext } from "../ModalContext";
import styles from "./modal.module.scss";
import { Dialog } from "@headlessui/react";
import PopupContentForm from "./PopupContentForm/PopupContentForm";

const Modal = () => {
  const { modal, deactivateModal } = useModalContext();

  return (

    <Dialog open={modal.isOpen} onClose={() => deactivateModal()}>
      <div className={styles.background} aria-hidden="true">
        <Dialog.Panel as="div" className={styles.content}>
          <Dialog.Title>Tell us your story</Dialog.Title>
          <Dialog.Description>Here you can enter text and images that tell your spatial story</Dialog.Description>
          <PopupContentForm marker={modal.currentMarker}/>
          <button onClick={() => deactivateModal()}>Cancel</button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Modal;
