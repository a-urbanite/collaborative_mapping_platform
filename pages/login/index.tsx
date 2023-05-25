import { useState } from "react";
import { useRouter } from 'next/router';
import styles from './login.module.css'
import { useUserContext } from '../../components/UserContext';
import { useModal } from "../../components/Modal/ModalContext";
import { useMarkerContext } from "../../components/MarkerContext";
import { auth } from "../../firebase-config";

const Login = () => {
  const { openModalWithSpinner, openModalWithError, closeModal } = useModal();
  const { allMarkers, defineUserMarkers } = useMarkerContext();
  const { signInWithEmail } = useUserContext()
  const router = useRouter()
  const [logInEmail, setlogInEmail] = useState<string>("");
  const [logInPassword, setlogInPassword] = useState<string>("");
  
  const signInWithEmailWrapper = async(event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault()
      openModalWithSpinner("Logging in...")
      const user = await signInWithEmail(logInEmail, logInPassword)
      defineUserMarkers(allMarkers, user)
      closeModal()
      router.push('/myPlaces')
    } catch (e: any) {
      console.error(e)
      openModalWithError("Unable to connect to Server! " + e.message)
    }
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