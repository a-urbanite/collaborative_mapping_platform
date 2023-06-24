import React from "react";
import MapLoader from "../../components/Map/MapLoader";
import styles from "./home.module.scss";
import { useMarkerContext } from "../../components/Map/MarkerContext";
import { useFirestoreController } from "../../components/FirestoreController/FirestoreController";
import { useModal } from "../../components/Modal/ModalContext";
import { useRouter } from "next/router";

export default function Home() {
  const { openModalWithSpinner, openModalWithError, closeModal } = useModal();
  const { fetchAllMarkers, markersUpdated, initialFetch } = useFirestoreController();
  const { setAllMarkers, allMarkers } = useMarkerContext();

  const router = useRouter();

  React.useEffect(() => {
    const handleStoryClick = (event: any) => {
      const button = event.target;
      const orderNum = button.getAttribute('data-orderNum');
      const title = button.getAttribute('data-title');
      const url = `/story/${orderNum}/${title.replace(" ", "_")}`;
      router.push(url);
    };
  
    const handleClick = (event: any) => {
      if (event.target.classList.contains('storyButton')) {
        handleStoryClick(event);
      }
    };
  
    document.addEventListener('click', handleClick);
  
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [router]);
  

  React.useEffect(() => {
    if (!initialFetch && !markersUpdated) return;

    openModalWithSpinner("Fetching Markers...");
    fetchAllMarkers().then((markers) => {
      setAllMarkers(markers);
      closeModal();
    }).catch((e) => {
      openModalWithError(`Error connecting to Server (${e.cause})`);
    })

  }, []);

  return (
    <div className={styles.homeContainer}>
      <MapLoader markers={allMarkers} />
      {/* <button onClick={}></button> */}
    </div>
  );
}
