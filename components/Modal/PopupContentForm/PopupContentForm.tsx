import React, { useEffect, useRef, useState } from "react";
import { useModalContext } from "../../ModalContext";
// import { useMapContext } from "../../MapContext";
import { useFireStoreContext } from "../../FireStoreContext";
import styles from "./popupContentForm.module.scss";

const PopupContentForm = ({ marker }: any) => {
  const { closeModal } = useModalContext();
  const { editMarkerPopupContent } = useFireStoreContext();
  const [title, setTitle] = useState(null as unknown as string);
  const [text, setText] = useState(null as unknown as string);

  useEffect(() => {
    setTitle(marker.popupContent.title || null);
    setText(marker.popupContent.text || null);
  }, []);

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editMarkerPopupContent(marker, title || "no title", text || "no text");
    closeModal();
  };

  return (
    <form className={styles.form} onSubmit={(e) => submitForm(e)}>
      <input
        className={styles.input}
        type="text"
        required
        placeholder="title"
        defaultValue={marker.popupContent.title || ""}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className={styles.textarea}
        placeholder="tell us your story..."
        defaultValue={marker.popupContent.text || ""}
        onChange={(e) => setText(e.target.value)}
      />
      <input className={styles.input} type="submit" value="Save" />
    </form>
  );
};

export default PopupContentForm;
