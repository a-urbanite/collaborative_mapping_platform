import React from 'react'
import styles from './popupContentForm.module.scss'

const PopupContentForm = ({returnResults, marker}: any) => {
  // const { closeModal } = useModalContext();
  // const {
  //   // editMarkerPopupContent,
  //   processEdits,
  // } = useMarkerContext();
  const [title, setTitle] = React.useState(null as unknown as string);
  const [text, setText] = React.useState(null as unknown as string);

  React.useEffect(() => {
    setTitle(marker.properties.popupContent.title || null);
    setText(marker.properties.popupContent.text || null);
  }, []);

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // editMarkerPopupContent(marker, title || "no title", text || "no text");
    returnResults({ title: title || "no title", text: text || "no text" })
    // processEdits(marker, {
    //   operation: "updatePopupContent",
    //   popupContent: { title: title || "no title", text: text || "no text" },
    // });
    // closeModal();
  };

  return (
    <form className={styles.form} onSubmit={(e) => submitForm(e)}>
    <input
      className={styles.input}
      type="text"
      required
      placeholder="title"
      defaultValue={marker.properties.popupContent.title || ""}
      onChange={(e) => setTitle(e.target.value)}
    />
    <textarea
      className={styles.textarea}
      placeholder="tell us your story..."
      defaultValue={marker.properties.popupContent.text || ""}
      onChange={(e) => setText(e.target.value)}
    />
    <input className={styles.input} type="submit" value="Save" />
  </form>
  )
}

export default PopupContentForm