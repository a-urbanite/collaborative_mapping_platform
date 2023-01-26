import styles from "./MainNav.module.scss";
import MenuPoint from "./MenuPoint";
import { useRouter } from "next/router";
import { AiFillSetting } from "react-icons/ai";
import { useUserContext } from "../../components/UserContext";

const MainNav = () => {
  const { isAuth, signOutUser } = useUserContext();

  return (
    <nav className={styles.mainNav}>
      <ul className={styles.list}>
        <MenuPoint href="/home">Home</MenuPoint>
        {/* {isAuth && <MenuPoint href="/editMap">My Places</MenuPoint>} */}
        {!isAuth && <MenuPoint href="/login">Log in</MenuPoint>}
        {isAuth && <MenuPoint href="/home" func={() => signOutUser()}>Log out</MenuPoint>}
        {isAuth && <MenuPoint href="/settings"><AiFillSetting/></MenuPoint>}
      </ul>
    </nav>
  );
};

export default MainNav;
