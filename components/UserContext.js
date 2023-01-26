import * as React from "react";
import { auth } from "../firebase-config";
import { useState } from "react";
import { signInWithEmailAndPassword, signOut, updateProfile, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";

const UserContext = React.createContext();

const UserContextProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false)

  const signInUser = (logInEmail, logInPassword) => {
    signInWithEmailAndPassword(auth, logInEmail, logInPassword)
      .catch((e) => {
        console.error(e);
        throw new Error();
      })
      .then(() => setIsAuth(true))
  };

  const signOutUser = () => {
    signOut(auth)
      .catch((e) => {
        console.error(e);
        throw new Error();
      })
      .then(() => {
        setIsAuth(false)
      });
  };

  const updateUser = async (name, email) => {
    updateProfile(auth.currentUser, { displayName: name, photoURL: "" })
      .catch((e) => {
        console.error(e);
        throw new Error();
      })
  };

  const signUpUser = (signupEmail, signupPassword) => {
    createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      .catch((e) => {
        console.error(e);
        throw new Error();
      })
  };


  return (
    <UserContext.Provider value={{ isAuth, signInUser, signOutUser, updateUser, signUpUser }}>
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => React.useContext(UserContext);

export { UserContextProvider, useUserContext };
