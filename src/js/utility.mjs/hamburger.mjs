import { hideElement, revealElement } from "../animation/fade.mjs";

/**
 * Toggles the hamburger menu.
 */
export function toggleHamburgerMenu() {
    updateBurgerMenu(isLoggedIn());
    try {
        const btnHamburger = document.getElementById('btn-hamburger');
        btnHamburger.classList.toggle('toggle');

        if (btnHamburger.classList.contains('toggle')) {
            revealElement('burger-menu');
        } else {
            hideElement('burger-menu');
        }
    } catch (error) {
        console.error("Error occurred in hamburger menu functionality:", error);
    }
}