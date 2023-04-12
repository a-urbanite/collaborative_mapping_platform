import * as React from "react";
import { auth } from "../firebase-config";
// import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const UserContext = React.createContext();

const UserContextProvider = ({ children }) => {
  const [isAuth, setisAuth] = React.useState(false);

  const signInWithEmail = (logInEmail, logInPassword) => {
    return new Promise(async (resolve, reject) => {
      try {
        await signInWithEmailAndPassword(auth, logInEmail, logInPassword);
        setisAuth(true);
        resolve(auth.currentUser);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
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
        // signInWithEmail, 
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
