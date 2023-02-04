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
  const [isAuth, setIsAuth] = useState(false);
  const [userObj, setUserObj] = useState(null);

  const handleError = (e) => {
    console.error(e);
    throw new Error();
  };

  const signInUser = (logInEmail, logInPassword) => {
    return new Promise(async (resolve, reject) => {
      try {
        await signInWithEmailAndPassword(auth, logInEmail, logInPassword);
        setUserObj(auth.currentUser);
        setIsAuth(true);
        resolve();
      } catch (err) {
        // handleError(err)
        console.error(err);
        reject(err);
      }
    });
  };

  const signOutUser = () => {
    signOut(auth)
      .catch((e) => handleError(e))
      .then(() => {
        setUserObj(null);
        setIsAuth(false);
      });
  };

  const updateUser = async (name, email) => {
    updateProfile(auth.currentUser, { displayName: name, photoURL: "" })
      .then(() => setUserObj(auth.currentUser))
      .catch((e) => handleError(e));
  };

  const signUpUser = (signupEmail, signupPassword) => {
    createUserWithEmailAndPassword(auth, signupEmail, signupPassword).catch((e) => handleError(e));
  };

  return (
    <UserContext.Provider value={{ isAuth, userObj, signInUser, signOutUser, updateUser, signUpUser }}>
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => React.useContext(UserContext);

export { UserContextProvider, useUserContext };
