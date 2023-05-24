import "../styles/globals.css";
import type { AppProps } from "next/app";
import MainNav from "../components/MainNav/MainNav";
import { UserContextProvider } from "../components/UserContext";
import { MarkerContextProvider } from "../components/MarkerContext";
import { FirestoreControllerProvider } from "../components/FirestoreController";
import { ModalProvider } from "../components/Modal/ModalContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main>
      <MarkerContextProvider>
        <UserContextProvider>
          <FirestoreControllerProvider>
              <ModalProvider>
                <MainNav />
                <Component {...pageProps} />
              </ModalProvider>
          </FirestoreControllerProvider>
        </UserContextProvider>
      </MarkerContextProvider>
    </main>
  );
}
