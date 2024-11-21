export default function updateNavigationUI(isLoggedIn, userData = {}) {
    // Get references to common elements
    const loginNavItemDesktop = document.getElementById("loginNavItemDesktop");
    const userInfoContainerDesktop = document.getElementById("userInfoContainerDesktop");
    const navAvatar = document.getElementById("navAvatar");
    const navAvatarPlaceholder = document.getElementById("navAvatarPlaceholder");
    const usernameDisplay = document.getElementById("usernameDisplay");

    const userInfoContainerMobile = document.getElementById("userInfoContainerMobile");
    const mobileNavAvatar = document.getElementById("mobileNavAvatar");
    const mobileUsernameDisplay = document.getElementById("mobileUsernameDisplay");
    const loginNavItemMobile = document.getElementById("loginNavItemMobile");

    const myAuctionsLinkDesktop = document.getElementById("myAuctionsLink");
    const myAuctionsLinkMobile = document.getElementById("myAuctionsLinkMobile");

    if (isLoggedIn) {
        // Show "My Auctions" links
        if (myAuctionsLinkDesktop) myAuctionsLinkDesktop.classList.remove("d-none");
        if (myAuctionsLinkMobile) myAuctionsLinkMobile.classList.remove("d-none");

        // Hide login button and show user info container
        loginNavItemDesktop.classList.add("d-none");
        userInfoContainerDesktop.classList.remove("d-none");

        // Update avatar and username for desktop
        if (userData.avatar && userData.avatar.url) {
            navAvatar.src = userData.avatar.url;
            navAvatar.alt = userData.avatar.alt || "User Avatar";
            navAvatar.classList.remove("d-none");
            navAvatarPlaceholder.classList.add("d-none");
        } else {
            navAvatar.classList.add("d-none");
            navAvatarPlaceholder.classList.remove("d-none");
        }
        usernameDisplay.textContent = userData.name || "Unknown User";

        // Handle the mobile navigation UI
        loginNavItemMobile.classList.add("d-none");
        userInfoContainerMobile.classList.remove("d-none");

        // Update avatar and username for mobile
        if (userData.avatar && userData.avatar.url) {
            mobileNavAvatar.src = userData.avatar.url;
            mobileNavAvatar.alt = userData.avatar.alt || "User Avatar";
            mobileNavAvatar.classList.remove("d-none");
        } else {
            mobileNavAvatar.classList.add("d-none");
        }
        mobileUsernameDisplay.textContent = userData.name || "Unknown User";
    } else {
        // Hide "My Auctions" links
        if (myAuctionsLinkDesktop) myAuctionsLinkDesktop.classList.add("d-none");
        if (myAuctionsLinkMobile) myAuctionsLinkMobile.classList.add("d-none");

        // Logged out state: Show login button and hide user info container
        loginNavItemDesktop.classList.remove("d-none");
        userInfoContainerDesktop.classList.add("d-none");

        loginNavItemMobile.classList.remove("d-none");
        userInfoContainerMobile.classList.add("d-none");

        // Reset avatar and username
        navAvatar.src = "";
        navAvatar.alt = "";
        mobileNavAvatar.src = "";
        mobileNavAvatar.alt = "";
    }
}
