import { useEffect } from "react";
import MapLoader from "../../components/Map/MapLoader";
import MarkerList from "../../components/MarkerList/MarkerList";
import styles from "./home.module.scss";

export default function Home(props: any) {
  useEffect(() => {
    console.log(props.markers)
  }, [props])
  
  return (
    <>
      <div className={styles.homeContainer}>
        <MapLoader markers={props.markers}/>
        <MarkerList />
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const url = `http://localhost:3000/api/locations`
  const res = await fetch(url)
  const markers = await res.json()
  return { props: { markers } }
}
