import { useRouter } from "next/router";
import React, { useState } from "react";
import { useUserContext } from "../../components/UserContext";
import styles from "../login/login.module.css";
import { useModal } from "../../components/Modal/ModalContext";

const SignUp = () => {
  const { openModalWithSpinner, closeModal, openModalWithError } = useModal();
  const { signUpUser } = useUserContext();
  const router = useRouter();

  const [signupEmail, setsignupEmail] = useState<string>("");
  const [signupPassword, setsignupPassword] = useState<string>("");

  const signupWithEmailWrapper = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      openModalWithSpinner("Signing Up...");
      const user = await signUpUser(signupEmail, signupPassword);
      // defineUserMarkers(allMarkers, user);
      await closeModal(1000);
      router.push("/myPlaces");
    } catch (e: any) {
      console.error(e);
      openModalWithError("Something went wrong! " + e.message);
    }
  };

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
