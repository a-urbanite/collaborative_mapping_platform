import React, { useEffect, useState } from 'react'
import router from 'next/router';
import styles from './Settings.module.css'
import { useUserContext } from "../../components/UserContext";
import { auth } from '../../firebase-config';

const Settings = () => {
  const { updateUser } = useUserContext();

  const [displayname, setdisplayname] = useState<string>(auth.currentUser ? auth.currentUser.displayName as string : "no_user");
  const [email, setemail] = useState<string>(auth.currentUser ? auth.currentUser.email as string : "no_email");
  const [message, setmessage] = useState('')
  // const [photoURL, setphotoURL] = useState<string>(auth.currentUser!.photoURL!);

  const updateUserProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await updateUser(displayname, email)
    setmessage('Success! information changed!')
    // router.reload()
  }
  
  
  return (
    <div className={styles.SettingsWrapper}>
      <h1>Settings</h1>
      <p>Welcome {displayname}! Change your profile information here.</p>
      <p>{message}</p>
      <br></br>
      {/* <img src={auth.currentUser?.photoURL?} className="profilePic" alt='profilePic'></img> */}
      <form className={styles.settingsForm} onSubmit={updateUserProfile}>
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
    </div>
  )
}

export default Settings