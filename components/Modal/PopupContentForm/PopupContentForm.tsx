import React, { useEffect, useRef, useState } from "react";
import { useDrawingContext } from "../../DrawingContext";
import { useModalContext } from "../../ModalContext";
import styles from "./popupContentForm.module.scss";

const PopupContentForm = ({marker}: any) => {
  const { deactivateModal } = useModalContext();
  const { editPopupContent } = useDrawingContext();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  // useEffect(() => {
  //   if (marker._popup) {
  //     console.log("already has popup", marker.mapLayerObj._popup.getContent())
  //   }
  //   console.log("has no popup yet")
  // }, [])
  

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editPopupContent(marker, title, text)
    deactivateModal()
    marker.mapLayerObj.bindPopup(`<h4>${title}</h4><p>${text}</p>`)
    marker.mapLayerObj.openPopup()
  };

  return (
    <form className={styles.form} onSubmit={(e) => submitForm(e)}>
      <input
        className={styles.input}
        type="text"
        placeholder="title"
        // value={marker._popup ? title : "has no stuff"}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className={styles.textarea}
        placeholder="tell us your story..."
        onChange={(e) => setText(e.target.value)}
      />
      <input className={styles.input} type="submit" value="Save" />
    </form>
  );
};

export default PopupContentForm;
