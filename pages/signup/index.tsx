import { useRouter } from "next/router";
import React, { useState } from "react";
import { useUserContext } from "../../components/UserContext";
import styles from "../login/login.module.css";
import { useModal } from "../../components/Modal/ModalContext";

const SignUp = () => {
  const { signUpUser } = useUserContext();
  const router = useRouter();

  const [signupEmail, setsignupEmail] = useState<string>("");
  const [signupPassword, setsignupPassword] = useState<string>("");

  const signupWithEmailWrapper = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      openModalWithSpinner("Logging in...");
      const user = await signInWithEmail(logInEmail, logInPassword);
      defineUserMarkers(allMarkers, user);
      closeModal();
      router.push("/myPlaces");
    } catch (e: any) {
      console.error(e);
      openModalWithError("Unable to connect to Server! " + e.message);
    }
  };

  // const signupWithEmailWrapper = async () => {
  //   await signUpUser(signupEmail, signupPassword);
  //   router.push("/login");
  // };

  return (
    <div className={styles.loginWrapper}>
      <h1 className="title"> Sign up </h1>
      <form className={styles.loginForm} onSubmit={signupWithEmailWrapper}>
        <input
          className={styles.loginForm__input}
          name="registerEmail"
          placeholder="Email..."
          onChange={(event) => {
            setsignupEmail(event.target.value);
          }}
        />
        <input
          className={styles.loginForm__input}
          type="password"
          name="registerPassword"
          placeholder="Password..."
          onChange={(event) => {
            setsignupPassword(event.target.value);
          }}
        />
        <input className={styles.loginForm__submit} type="submit" autoFocus value="Sign up!" />
      </form>
    </div>
  );
};

export default SignUp;
