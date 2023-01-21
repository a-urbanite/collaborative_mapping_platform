import React, { useEffect, useRef, useState } from "react";
import { useModalContext } from "../../ModalContext";
import { useMapContext } from "../../MapContext";
import styles from "./popupContentForm.module.scss";

const PopupContentForm = ({marker}: any) => {
  const { deactivateModal } = useModalContext();
  const { editMarkerPopupContent } = useMapContext();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editMarkerPopupContent(marker, title, text)
    deactivateModal()
  };

  return (
    <form className={styles.form} onSubmit={(e) => submitForm(e)}>
      <input
        className={styles.input}
        type="text"
        placeholder="title"
        defaultValue={marker.popupContent ? marker.popupContent.title : ""}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className={styles.textarea}
        placeholder="tell us your story..."
        defaultValue={marker.popupContent ? marker.popupContent.text : ""}
        onChange={(e) => setText(e.target.value)}
      />
      <input className={styles.input} type="submit" value="Save" />
    </form>
  );
};

export default PopupContentForm;
