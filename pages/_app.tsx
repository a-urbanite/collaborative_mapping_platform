import "../styles/globals.css";
import type { AppProps } from "next/app";
import MainNav from "../components/MainNav/MainNav";
import { UserContextProvider } from "../components/UserContext";
import { ModalContextProvider } from "../components/ModalContext";
import { MarkerContextProvider } from "../components/MarkerContext";
import { FirestoreControllerProvider } from "../components/FirestoreController";
import Modal from "../components/Modal/Modal";
import { ModalProvider } from "../components/Modal2/Modal2Context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main>
      <MarkerContextProvider>
        <UserContextProvider>
          <FirestoreControllerProvider>
            <ModalContextProvider>
              <ModalProvider>
                <Modal />
                <MainNav />
                <Component {...pageProps} />
              </ModalProvider>
            </ModalContextProvider>
          </FirestoreControllerProvider>
        </UserContextProvider>
      </MarkerContextProvider>
    </main>
  );
}
