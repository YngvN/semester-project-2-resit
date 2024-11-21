/**
 * Function to update active links based on href attributes
 */
export default function setActiveLink() {
    // Get current pathname
    const currentPath = window.location.pathname;
    console.log("Current Path:", currentPath);

    // Remove 'active' class from all links
    document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));

    // Initialize variable for logging
    let activeNavItem = null;

    // Select all nav-links
    const navLinks = document.querySelectorAll(".nav-link");

    // Iterate over each nav-link
    navLinks.forEach(link => {
        // Get the href attribute of the link
        const linkHref = link.getAttribute('href');

        if (linkHref) {
            // Create a URL object to parse the href
            const linkUrl = new URL(linkHref, window.location.origin);

            // Compare the pathname of the link with the current path
            if (linkUrl.pathname === currentPath) {
                // Add 'active' class to the matching link
                link.classList.add('active');
                activeNavItem = link;
            }
        }
    });

    // Log the active nav item if found
    if (activeNavItem) {
        console.log("Active Nav Item:", activeNavItem);
    } else {
        console.log("No active navigation link found for the current path.");
    }
}
