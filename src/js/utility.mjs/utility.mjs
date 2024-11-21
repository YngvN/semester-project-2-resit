import { toggleHamburgerMenu } from "./hamburger.mjs";
import { checkLoginStatus } from "../api/checkLogin.mjs";
import setActiveLink from "./setActive.mjs";

window.toggleHamburgerMenu = toggleHamburgerMenu;

checkLoginStatus();
setActiveLink();