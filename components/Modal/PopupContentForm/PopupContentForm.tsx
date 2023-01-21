import React, { useEffect, useRef, useState } from "react";
import { useModalContext } from "../../ModalContext";
import { useMapContext } from "../../MapContext";
import styles from "./popupContentForm.module.scss";

const PopupContentForm = ({marker}: any) => {
  const { deactivateModal } = useModalContext();
  const { editMarkerPopupContent } = useMapContext();
  const [title, setTitle] = useState(null as unknown as string);
  const [text, setText] = useState(null as unknown as string);

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const getTitleToSubmit = () => {
      if ( title) {
        return title
      } 
      if ( typeof title === null && marker.popupContent) {
        return marker.popupContent.title
      }
      if ( typeof title === "string" && title.length === 0 && marker.popupContent) {
        return "no title"
      }
      if ( !title && !marker.popupContent) {
        return "no title"
      }
    }
    const titleToSubmit = getTitleToSubmit()
    const textToSubmit = (text ) ? text : (marker.popupContent ? marker.popupContent.text : "no text")
    editMarkerPopupContent(marker, titleToSubmit, textToSubmit)
    deactivateModal()
  };

  return (
    <form className={styles.form} onSubmit={(e) => submitForm(e)}>
      <input
        className={styles.input}
        type="text"
        required
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
