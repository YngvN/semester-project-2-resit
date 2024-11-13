import { hideElement, revealElement } from "../animation/fade.mjs";

/**
 * Toggles the visibility of the hamburger menu.
 */
export function toggleHamburgerMenu() {
    try {
        const mobileNav = document.getElementById('mobileNav');
        const btnHamburger = document.getElementById('btn-hamburger');

        // Toggle the "show" class to control visibility
        mobileNav.classList.toggle('show');

        // Check if the "show" class is present and reveal or hide the menu accordingly
        if (mobileNav.classList.contains('show')) {
            revealElement(mobileNav);
            btnHamburger.style.display = 'none'; // Hide the toggle button
        } else {
            hideElement(mobileNav);
            btnHamburger.style.display = 'block'; // Show the toggle button
        }
    } catch (error) {
        console.error("Error occurred in hamburger menu functionality:", error);
    }
}
