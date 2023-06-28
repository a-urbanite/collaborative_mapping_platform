import React from 'react'
import { useMarkerContext } from '../../components/Map/MarkerContext'
import { useModal } from '../../components/Modal/ModalContext';
import { useFirestoreController } from '../../components/FirestoreController/FirestoreController';
import StoryCard from './StoryCard';

const Index = () => {
  const { allMarkers, setAllMarkers } = useMarkerContext();
  const { openModalWithSpinner, openModalWithError, closeModal } = useModal();
  const { fetchAllMarkers, markersUpdated, initialFetch } = useFirestoreController();

  React.useEffect(() => {
    if (!initialFetch && !markersUpdated) return;

    openModalWithSpinner("Fetching Markers...");
    fetchAllMarkers()
      .then((markers) => {
        setAllMarkers(markers);
        closeModal();
      })
      .catch((e) => {
        openModalWithError(`Error connecting to Server (${e.cause})`);
      });
  }, []);


  return (
    <>
      <h1>Welcome to the story archive!</h1>
      <ul>
        {Array.from(allMarkers.values()).map((marker, i) => {
          return (
            <StoryCard key={i} marker={marker}/>
          )
        })}
      </ul>
    </>
  )
}

export default Index