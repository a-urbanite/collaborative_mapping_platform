import * as React from "react";
import { useModalContext } from "../../ModalContext";
import { useMarkerContext } from "../../MarkerContext";
import styles from "./popupContentForm.module.scss";
import { uuidv4 } from '@firebase/util';
import { User } from "firebase/auth";

const UserNameForm = ({ marker }: any) => {
  const { closeModal } = useModalContext();
  const { processEdits } = useMarkerContext();
  const [userName, setUserName] = React.useState("anon" as unknown as string);

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userObj = { uid: uuidv4(), displayName: userName } as User
    console.log("altUSEROBJ: ", userObj)
    console.log("makrer insie submit func", marker)
    processEdits(marker, { operation: "addMarker", userObj: userObj })
    // processEdits(marker, {
    //   operation: "updatePopupContent",
    //   popupContent: { title: title || "no title", text: text || "no text" },
    // });
    closeModal();
  };

  return (
    <form onSubmit={(e) => submitForm(e)}>
      <input type="text" placeholder="your name" id="userNameInput" onChange={(e) => setUserName(e.target.value)}></input>
      <input type="submit"></input>
    </form>
  );
};

export default UserNameForm;
