import { toggleHamburgerMenu } from "./hamburger.mjs";
import { checkLoginStatus } from "../api/checkLogin.mjs";
import setActiveLink from "./setActive.mjs";
import { buildModal } from "../components/modal/modalBuilder.mjs";

window.toggleHamburgerMenu = toggleHamburgerMenu;

// Check login status and set active link
checkLoginStatus();
setActiveLink();
