import "../styles/globals.css";
import type { AppProps } from "next/app";
import MainNav from "../components/MainNav/MainNav";
import { UserContextProvider } from "../components/UserContext";
import { ModalContextProvider } from "../components/ModalContext";
import { MarkerContextProvider } from "../components/MarkerContext";
import { FirestoreControllerProvider } from "../components/FirestoreController";
import Modal from "../components/Modal/Modal";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main>
      <MarkerContextProvider>
        <UserContextProvider>
          <FirestoreControllerProvider>
            <ModalContextProvider>
              <Modal />
              <MainNav />
              <Component {...pageProps} />
            </ModalContextProvider>
          </FirestoreControllerProvider>
        </UserContextProvider>
      </MarkerContextProvider>
    </main>
  );
}
