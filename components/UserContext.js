import * as React from "react";
import { auth } from "../firebase-config";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const UserContext = React.createContext();

const UserContextProvider = ({ children }) => {
  const [isAuth, setisAuth] = useState(false);

  const signInWithEmail = async (logInEmail, logInPassword) => {
    signInWithEmailAndPassword(auth, logInEmail, logInPassword)
      .then(() => {
        setisAuth(true);
        console.log("user logged in");
      })
      .catch((err) => console.error(err));
  };

  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        setisAuth(false);
      })
      .catch((e) => console.error(e));
  };

  const updateUser = async (name, email) => {
    updateProfile(auth.currentUser, { displayName: name, photoURL: "" })
      .then(() => {
        console.log("user upadted");
      })
      .catch((e) => console.error(e));
  };

  const signUpUser = (signupEmail, signupPassword) => {
    createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      .then(() => {
        console.log("user created");
      })
      .catch((e) => console.error(e));
  };

  return (
    <UserContext.Provider
      value={{
        isAuth,
        signInWithEmail,
        signOutUser,
        updateUser,
        signUpUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => React.useContext(UserContext);

export { UserContextProvider, useUserContext };
