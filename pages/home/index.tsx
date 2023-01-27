import MapLoader from "../../components/Map/MapLoader";
import MarkerList from "../../components/MarkerList/MarkerList";
import styles from "./home.module.scss";

export default function Home() {
  return (
    <>
      <div className={styles.homeContainer}>
        <MapLoader />
        <MarkerList />
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const url = `http://localhost:3000/api/locations`
  const res = await fetch(url)
  const locations = await res.json()
  return { props: { locations } }
}
