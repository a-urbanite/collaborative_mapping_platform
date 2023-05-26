import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./login.module.css";
import { useUserContext } from "../../components/UserContext";
import { useModal } from "../../components/Modal/ModalContext";
import { useMarkerContext } from "../../components/Map/MarkerContext";

const Login = () => {
  const { openModalWithSpinner, openModalWithError, closeModal, openModalWithNotification } = useModal();
  const { allMarkers, defineUserMarkers } = useMarkerContext();
  const { signInWithEmail } = useUserContext();
  const router = useRouter();

  const [logInEmail, setlogInEmail] = useState<string>("");
  const [logInPassword, setlogInPassword] = useState<string>("");

  const signInWithEmailWrapper = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      openModalWithSpinner("Logging in...");
      const user = await signInWithEmail(logInEmail, logInPassword);
      defineUserMarkers(allMarkers, user);
      await closeModal();
      router.push("/myPlaces");
    } catch (e: any) {
      console.error(e);
      openModalWithError("Unable to connect to Server! " + e.message);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <button onClick={() => openModalWithNotification()}>here</button>
      <h1>Sign in</h1>
      <form className={styles.loginForm} onSubmit={signInWithEmailWrapper}>
        <input
          className={styles.loginForm__input}
          name="loginMail"
          placeholder="Email..."
          required
          onChange={(event) => {
            setlogInEmail(event.target.value);
          }}
        ></input>
        <input
          className={styles.loginForm__input}
          type="password"
          name="loginPassword"
          placeholder="password..."
          required
          onChange={(event) => {
            setlogInPassword(event.target.value);
          }}
        ></input>
        <input className={styles.loginForm__submit} type="submit" autoFocus value="Go!" />
      </form>
      <p>not registered yet?</p>
      <button className={styles.loginForm__submit} onClick={() => router.push("/signup")}>
        Sign up!
      </button>
    </div>
  );
};

export default Login;
