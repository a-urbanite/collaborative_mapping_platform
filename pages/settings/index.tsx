import React from 'react'
import router from 'next/router';
import styles from './Settings.module.css'
import { useUserContext } from "../../components/UserContext";
import { auth } from '../../firebase-config';
import { useFirestoreController } from '../../components/FirestoreController/FirestoreController';
import { useModal } from '../../components/Modal/ModalContext';
import { useMarkerContext } from '../../components/Map/MarkerContext';

const Settings = () => {
  const { updateUser } = useUserContext();
  const { deleteAllMarkers } = useFirestoreController();
  const { openModalWithSpinner, openModalWithNotification, openModalWithError, closeModal } = useModal();
  // const { allMarkers } = useMarkerContext();

  const [displayname, setdisplayname] = React.useState<string>(auth.currentUser ? auth.currentUser.displayName as string : "no_user");
  const [email, setemail] = React.useState<string>(auth.currentUser ? auth.currentUser.email as string : "no_email");
  // const [message, setmessage] = React.useState('')
  // const [photoURL, setphotoURL] = useState<string>(auth.currentUser!.photoURL!);


  const updateUserProfileInteraction = async (event: React.FormEvent<HTMLFormElement>) => {

    try {
      event.preventDefault()
      openModalWithSpinner("Uploading Edits");
      await updateUser(displayname, email)
      openModalWithNotification("Success!")
      await closeModal(3000);
      router.reload
    } catch (e: any) {
      console.error(e)
      openModalWithError(e.message);
    }
  }

  const deleteAllMarkersInteraction = async () => {
    try {
      openModalWithSpinner("Uploading Edits");
      if (window.confirm("delete all markers?")) {
        await deleteAllMarkers();
      } 
      await closeModal(1000);
      router.push("/home");
    } catch (e: any) {
      console.error(e)
      openModalWithError(e.message);
    }
  }
  
  
  return (
    <div className={styles.SettingsWrapper}>
      <h1>Settings</h1>
      <p>Welcome {displayname}! Change your profile information here.</p>
      {/* <p>{message}</p> */}
      <br></br>
      {/* <img src={auth.currentUser?.photoURL?} className="profilePic" alt='profilePic'></img> */}
      <form className={styles.settingsForm} onSubmit={updateUserProfileInteraction}>
        <label htmlFor="displayname">User name:</label>
        <input 
          id='displayname' 
          className={styles.settingsForm__input}
          onChange={(event) => {setdisplayname(event.target.value)}} 
          defaultValue={displayname}/>
        {/* <label htmlFor="photoURL">photo URL:</label>
        <input id='photoURL' onChange={(event) => {setphotoURL(event.target.value)}} defaultValue={photoURL}></input> */}
        <label htmlFor="email">Email:</label>
        <input 
          readOnly
          id='email' 
          className={styles.settingsForm__input}
          onChange={(event) => {setemail(event.target.value)}} 
          defaultValue={email}/>
        <input type="submit" value="Go!" className={styles.settingsForm__submit}/>
      </form>
      <h2>ADMIN AREA</h2>
      <button onClick={ () => deleteAllMarkersInteraction() }>delete all markers</button>
    </div>
  )
}

export default Settings