import React from 'react'
import { FirestoreMarker } from '../../../../Types';
import styles from "./StoryCard.module.scss"
import { useRouter } from 'next/router';

interface StoryCardInterface {
  marker: FirestoreMarker
}

const StoryCard = ({marker}: StoryCardInterface) => {
  const router = useRouter();

  const orderNum = marker?.properties.orderNum
  const urlTitle = marker?.properties.popupContent.title.replace(" ","_")

  if (!marker) return <></>

  return (
    <li onClick={() => router.push(`/story/${orderNum}/${urlTitle}`)}>
      <div className={styles.storyCardContainer}>
        {marker.properties.popupContent.title}
      </div>
    </li>
  )
}

export default StoryCard