import { useState } from "react";
import { useRouter } from 'next/router';
import styles from './login.module.css'
import { useUserContext } from '../../components/UserContext';
import { useModalContext } from "../../components/ModalContext";
import { useFireStoreContext } from "../../components/FireStoreContext";
import { auth } from "../../firebase-config";

const Login = () => {
  const { defineUserMarkers } = useFireStoreContext();
  const { openModalWithSpinner, openModalWithError, closeModal } = useModalContext();
  const { signInWithEmail } = useUserContext()
  const router = useRouter()
  const [logInEmail, setlogInEmail] = useState<string>("");
  const [logInPassword, setlogInPassword] = useState<string>("");

  
  const signInWithEmailWrapper = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    openModalWithSpinner("Logging in...")
    signInWithEmail(logInEmail, logInPassword)
      .then(() => {
        defineUserMarkers(auth.currentUser)
        closeModal()
        router.push('/myPlaces')
      })
      .catch(() => {
        openModalWithError("Unable to connect to Server!")
      })
  }

  return (
    <div className={styles.loginWrapper}>
      <h1>Sign in</h1>
      <form className={styles.loginForm} onSubmit={signInWithEmailWrapper}>
        <input 
          className={styles.loginForm__input}
          name='loginMail' 
          placeholder='Email...'
          required
          onChange={(event) => {setlogInEmail(event.target.value)}}>
        </input>
        <input 
          className={styles.loginForm__input}
          type="password"
          name='loginPassword' 
          placeholder='password...'
          required
          onChange={(event) => {setlogInPassword(event.target.value)}}>
        </input>
        <input 
          className={styles.loginForm__submit}
          type="submit" 
          autoFocus 
          value="Go!"/> 
      </form>
      <p>not registered yet?</p>
      <button className={styles.loginForm__submit} onClick={() => router.push('/signup')}>Sign up!</button>
    </div>
  )
}

export default Login