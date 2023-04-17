import "../styles/globals.css";
import type { AppProps } from "next/app";
import MainNav from "../components/MainNav/MainNav";
import { UserContextProvider } from "../components/UserContext";
import { ModalContextProvider } from "../components/ModalContext";
import { FireStoreContextProvider } from "../components/FireStoreContext";
import { FirestoreControllerProvider } from "../components/FirestoreController";
import Modal from "../components/Modal/Modal";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main>
      <FireStoreContextProvider>
        <UserContextProvider>
          <FirestoreControllerProvider>
            <ModalContextProvider>
              <Modal />
              <MainNav />
              <Component {...pageProps} />
            </ModalContextProvider>
          </FirestoreControllerProvider>
        </UserContextProvider>
      </FireStoreContextProvider>
    </main>
  );
}
