/**
 * Function to update active links based on href attributes
 */
export default function setActiveLink() {
    const currentPath = window.location.pathname;

    document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));

    let activeNavItem = null;

    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');

        if (linkHref) {
            const linkUrl = new URL(linkHref, window.location.origin);

            if (linkUrl.pathname === currentPath) {
                link.classList.add('active');
                activeNavItem = link;
            }
        }
    });

}
