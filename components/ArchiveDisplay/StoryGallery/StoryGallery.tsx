import React from 'react'
import StoryCard from './StoryCard/StoryCard'
import { MarkerMap } from '../../../Types';

interface StoryGalleryInterface {
  currentPageContents: MarkerMap
}

const StoryGallery = ({allMarkers}: StoryGalleryInterface) => {

  return (
    <ul>
    {Array.from(allMarkers.values()).map((marker, i) => {
      return (
        <StoryCard key={i} marker={marker}/>
      )
    })}
  </ul>
  )
}

export default StoryGallery