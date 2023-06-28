import React from "react";
import { useRouter } from "next/router";
import { useMarkerContext } from "../../../../components/Map/MarkerContext";
import { FirestoreMarker } from "../../../../Types";
import { useModal } from "../../../../components/Modal/ModalContext";
import { useFirestoreController } from "../../../../components/FirestoreController/FirestoreController";
import MapLoader from "../../../../components/Map/MapLoader";
import styles from "./storypage.module.scss";

const StoryPage = () => {
  const router = useRouter();
  const { openModalWithSpinner, openModalWithError, closeModal } = useModal();
  const { fetchSingleMarker } = useFirestoreController();
  const [currentMarker, setcurrentMarker] = React.useState(null as unknown as FirestoreMarker);

  React.useEffect(() => {
    if (!router.isReady) return;
    openModalWithSpinner("Fetching Marker...");
    const orderNum = Number(router.query.orderNum);
    const title = router.query.title as string;
    fetchSingleMarker(orderNum, title)
      .then((marker) => {
        setcurrentMarker(marker);
        closeModal();
      })
      .catch((e) => {
        openModalWithError(`Server Error: (${e.cause})`);
      });
  }, [router.isReady]);

  if (currentMarker)
    return (

      <div className={styles.pageContainer}>
        <div className={styles.leftColumn}>
          <h2>{currentMarker.properties.popupContent.title}</h2>
          <p>{currentMarker.properties.popupContent.text}</p>
          <button onClick={() => router.back()}>Back</button>
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.mapContainer}>
            <MapLoader
              markers={new Map([[currentMarker.properties.markerId, currentMarker]])}
              // className={"smallMap"}
            />
          </div>
        </div>
      </div>
    );

  if (!currentMarker) return <></>;
};

export default StoryPage;
