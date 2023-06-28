import React from 'react'
import { useRouter } from "next/router";
import { useMarkerContext } from '../../../components/Map/MarkerContext';
import { useModal } from '../../../components/Modal/ModalContext';
import { useFirestoreController } from '../../../components/FirestoreController/FirestoreController';

const Index = () => {
  const router = useRouter();
  const { findMarkerByOrderNum, allMarkers } = useMarkerContext();
  const { openModalWithSpinner, closeModal, openModalWithError } = useModal();
  const { fetchSingleMarker } = useFirestoreController();

  React.useEffect(() => {
    if (!router.isReady) return;
    openModalWithSpinner("Fetching Marker...");
    const orderNum = Number(router.query.orderNum);
    fetchSingleMarker(orderNum, "")
      .then((marker) => {
        closeModal();
        const title = marker.properties.popupContent.title.replace(" ","_")
        router.push(`/story/${orderNum}/${title}`)
      })
      .catch((e) => {
        openModalWithError(`Server Error: (${e.cause})`);
      });
  }, [router.isReady]);

  return (
    <div>index</div>
  )
}

export default Index