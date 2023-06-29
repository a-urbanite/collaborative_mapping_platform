import React from 'react'
import { useMarkerContext } from '../../components/Map/MarkerContext'
import { useModal } from '../../components/Modal/ModalContext';
import { useFirestoreController } from '../../components/FirestoreController/FirestoreController';
import StoryGallery from '../../components/ArchiveDisplay/StoryGallery/StoryGallery';
import Pagination from '../../components/ArchiveDisplay/Pagination/Pagination';

const Index = () => {
  const { allMarkers, setAllMarkers } = useMarkerContext();
  const { openModalWithSpinner, openModalWithError, closeModal } = useModal();
  const { fetchAllMarkers, markersUpdated, initialFetch } = useFirestoreController();

  const [currentPage, setcurrentPage] = React.useState<number>(1);
  const [currentPageContents, setcurrentPageContents] = React.useState<any>([])

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
      <Pagination allMarkers={allMarkers} currentPage={currentPage} setcurrentPage={setcurrentPage}/>
      <StoryGallery allMarkers={allMarkers}/>
    </>
  )
}

export default Index