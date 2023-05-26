import styles from "./MainNav.module.scss";
import MenuPoint from "./MenuPoint";
import { AiFillSetting } from "react-icons/ai";
import { useUserContext } from "../../components/UserContext";
import { useMarkerContext } from "../Map/MarkerContext";

const MainNav = () => {
  const { isLoggedIn, signOutUser } = useUserContext();
  const { setUserMarkers } = useMarkerContext();

  return (
    <nav className={styles.mainNav}>
      <ul className={styles.list}>
        <MenuPoint href="/home">Home</MenuPoint>
        {!isLoggedIn && <MenuPoint href="/contribute">contribute</MenuPoint>}
        <MenuPoint href="/aboutUs">About Us</MenuPoint>
        {isLoggedIn && <MenuPoint href="/myPlaces">My Places</MenuPoint>}
        {!isLoggedIn && <MenuPoint href="/login">Log in</MenuPoint>}
        {isLoggedIn && (
          <MenuPoint
            href="/home"
            func={() => {
              signOutUser();
              setUserMarkers(new Map());
            }}
          >
            Log out
          </MenuPoint>
        )}
        {isLoggedIn && (
          <MenuPoint href="/settings">
            <AiFillSetting />
          </MenuPoint>
        )}
      </ul>
    </nav>
  );
};

export default MainNav;
