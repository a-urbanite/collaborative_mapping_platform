import React from "react";
import { useRouter } from "next/router";
import { useMarkerContext } from "../../../../components/Map/MarkerContext";
import { FirestoreMarker } from "../../../../Types";
import { useModal } from "../../../../components/Modal/ModalContext";
import { useFirestoreController } from "../../../../components/FirestoreController/FirestoreController";

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
    fetchSingleMarker(orderNum, title).then((marker) => {
      setcurrentMarker(marker);
      closeModal();
    }).catch((e) => {
      openModalWithError(`Server Error: (${e.cause})`);
    })

  }, [router.isReady]);

  return (
    <>
      <div>StoryPage</div>
      { currentMarker && <h2>{currentMarker.properties.popupContent.title}</h2>}
      { currentMarker && <p>{currentMarker.properties.popupContent.text}</p>}
      <button onClick={() => router.push("/home")}>Back</button>
    </>
  );
};

export default StoryPage;
