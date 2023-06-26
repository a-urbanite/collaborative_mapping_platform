import React from 'react'
import { useRouter } from 'next/router'

const EventListenersForStoryButtons = () => {
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

  return (
    <></>
  )
}

export default EventListenersForStoryButtons