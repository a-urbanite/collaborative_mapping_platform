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
