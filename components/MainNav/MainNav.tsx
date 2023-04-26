import styles from "./MainNav.module.scss";
import MenuPoint from "./MenuPoint";
import { AiFillSetting } from "react-icons/ai";
import { useUserContext } from "../../components/UserContext";
import { useMarkerContext } from "../MarkerContext";

const MainNav = () => {
  const { isAuth, signOutUser } = useUserContext();
  const { setUserFirestoreMarkers } = useMarkerContext();

  return (
    <nav className={styles.mainNav}>
      <ul className={styles.list}>
        <MenuPoint href="/home">Home</MenuPoint>
        <MenuPoint href="/contribute">contribute</MenuPoint>
        <MenuPoint href="/aboutUs">About Us</MenuPoint>
        {isAuth && <MenuPoint href="/myPlaces">My Places</MenuPoint>}
        {!isAuth && <MenuPoint href="/login">Log in</MenuPoint>}
        {isAuth && (
          <MenuPoint
            href="/home"
            func={() => {
              signOutUser();
              setUserFirestoreMarkers(new Map());
            }}
          >
            Log out
          </MenuPoint>
        )}
        {isAuth && (
          <MenuPoint href="/settings">
            <AiFillSetting />
          </MenuPoint>
        )}
      </ul>
    </nav>
  );
};

export default MainNav;
