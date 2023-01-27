import "../styles/globals.css";
import type { AppProps } from "next/app";
import MainNav from "../components/MainNav/MainNav";
import { UserContextProvider } from "../components/UserContext";
import { ModalContextProvider } from "../components/ModalContext";
import { MapContextProvider } from "../components/MapContext";
import { FireStoreContextProvider } from "../components/FireStoreContext";
import Modal from "../components/Modal/Modal";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main>
      <FireStoreContextProvider>
        <UserContextProvider>
          <MapContextProvider>
            <ModalContextProvider>
              <Modal />
              <MainNav />
              <Component {...pageProps} />
            </ModalContextProvider>
          </MapContextProvider>
        </UserContextProvider>
      </FireStoreContextProvider>
    </main>
  );
}
