import * as React from "react";
import { auth } from "../firebase-config";
import {
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { FirebaseUser } from "./FirestoreController/Types";

interface UserContextValue {
  isLoggedIn: boolean; 
  signInWithEmail: (logInEmail: string, logInPassword: string) => Promise<FirebaseUser>;
  signOutUser: () => void;
  updateUser: (name: string, email: string) => void;
  signUpUser: (signupEmail: string, signupPassword: string) => void;
}

interface UserProviderProps {
  children: React.ReactNode;
}

const UserContext = React.createContext(null as unknown as UserContextValue);

const UserContextProvider = ({ children }: UserProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const signInWithEmail = async (logInEmail: string, logInPassword: string): Promise<FirebaseUser> => {
    try {
      const res = await signInWithEmailAndPassword(auth, logInEmail, logInPassword);
      console.log("RES: ", res)
      setIsLoggedIn(true);
      return res.user;
    } catch (err) {
      console.error(err);
      throw new Error("Auth Server Error", {cause: err})
    }
  };

  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        setIsLoggedIn(false);
      })
      .catch((e) => console.error(e));
  };

  const updateUser = async (name: string, email: string) => {
    updateProfile(auth.currentUser!, { displayName: name, photoURL: "" })
      .then(() => {
        console.log("user upadted");
      })
      .catch((e) => console.error(e));
  };

  const signUpUser = (signupEmail: string, signupPassword: string) => {
    createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      .then(() => {
        console.log("user created");
      })
      .catch((e) => console.error(e));
  };

  return (
    <UserContext.Provider
      value={{
        isLoggedIn, 
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
