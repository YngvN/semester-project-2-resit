

import { makeRequest } from "./url.mjs";

/**
 * Fetches detailed user data based on the profile name and stores it as an object in loginData.
 * @param {string} profileName - The profile name (username) to search for.
 * @returns {object|null} - The user profile data if successful, otherwise null.
 */
async function fetchUserProfile(profileName) {
    try {
        const result = await makeRequest("profiles", profileName, '', 'GET', null, {}, true);
        if (result && result.data) {
            const profileData = result.data;

            // Structure userData as an object
            const userData = {
                name: profileData.name,
                email: profileData.email,
                credits: profileData.credits,
                avatar: profileData.avatar || { url: "", alt: "No avatar available" },
                banner: profileData.banner || { url: "", alt: "No banner available" },
                bio: profileData.bio || "No bio available",
                listingsCount: profileData._count?.listings || 0,
                winsCount: profileData._count?.wins || 0
            };

            return userData;
            console.log("Fetching userdata")
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
    }
    return null;
}

export default fetchUserProfile;

/**
 * Checks login status, updates the UI, and handles logout.
 */
export async function checkLoginStatus() {
    const storedLoginData = localStorage.getItem("loginData") || sessionStorage.getItem("loginData");
    const loginData = storedLoginData ? JSON.parse(storedLoginData) : null;
    const profileName = loginData?.userData?.name || loginData?.data?.name;

    if (!profileName) {
        displayLoggedOutState();
        return;
    }

    const userData = await fetchUserProfile(profileName);

    if (userData) {

        // Update loginData with userData
        loginData.userData = userData;

        // Save updated loginData to storage
        localStorage.setItem("loginData", JSON.stringify(loginData));
        // UI elements for Desktop
        const loginNavItemDesktop = document.getElementById("loginNavItemDesktop");
        const userInfoContainerDesktop = document.getElementById("userInfoContainerDesktop");
        const navAvatar = document.getElementById("navAvatar");
        const navAvatarPlaceholder = document.getElementById("navAvatarPlaceholder");
        const usernameDisplay = document.getElementById("usernameDisplay");

        // UI elements for Mobile
        const userInfoContainerMobile = document.getElementById("userInfoContainerMobile");
        const mobileNavAvatar = document.getElementById("mobileNavAvatar");
        const mobileUsernameDisplay = document.getElementById("mobileUsernameDisplay");
        const loginNavItemMobile = document.getElementById("loginNavItemMobile");

        // Header element to apply the banner background
        const headerElement = document.querySelector("header.navbar");

        // Set banner background if available
        if (userData.banner && userData.banner.url) {
            headerElement.style.backgroundImage = `url(${userData.banner.url})`;
            headerElement.style.backgroundSize = "cover";
            headerElement.style.backgroundPosition = "center";
            headerElement.style.backgroundRepeat = "no-repeat";
        }

        // Desktop nav: Hide login, show user info container
        if (loginNavItemDesktop) loginNavItemDesktop.classList.add("d-none");
        if (userInfoContainerDesktop) userInfoContainerDesktop.classList.remove("d-none");

        // Display avatar or placeholder in desktop nav
        if (userData.avatar && userData.avatar.url) {
            navAvatar.src = userData.avatar.url;
            navAvatar.alt = userData.avatar.alt || "User avatar";
            navAvatar.classList.remove("d-none");
            navAvatarPlaceholder.classList.add("d-none");
        } else {
            navAvatar.classList.add("d-none");
            navAvatarPlaceholder.classList.remove("d-none");
        }

        // Set username display in desktop nav
        usernameDisplay.textContent = userData.name || "Unknown User";

        // Mobile nav: Hide login, show user info container
        if (loginNavItemMobile) loginNavItemMobile.classList.add("d-none");
        if (userInfoContainerMobile) userInfoContainerMobile.classList.remove("d-none");
        mobileUsernameDisplay.textContent = userData.name || "Unknown User";
        mobileNavAvatar.src = userData.avatar?.url || "";
        mobileNavAvatar.alt = userData.avatar?.alt || "User avatar";
        mobileNavAvatar.classList.remove("d-none");

    } else {
        // Display logged-out state if user data is not available
        displayLoggedOutState();
    }

    // Attach logout functionality to both desktop and mobile logout buttons
    document.querySelectorAll("#logout").forEach(button => {
        button.addEventListener("click", function () {
            localStorage.removeItem("loginData");
            sessionStorage.removeItem("loginData");
            location.reload();
        });
    });
}

/**
 * Displays the logged-out state of the navigation UI.
 */
function displayLoggedOutState() {
    const loginNavItemDesktop = document.getElementById("loginNavItemDesktop");
    const userInfoContainerDesktop = document.getElementById("userInfoContainerDesktop");
    const loginNavItemMobile = document.getElementById("loginNavItemMobile");
    const userInfoContainerMobile = document.getElementById("userInfoContainerMobile");
    const headerElement = document.querySelector("header.navbar");

    // Remove any banner background if the user is not logged in
    headerElement.style.backgroundImage = "";

    // Desktop nav: Show login, hide user info container
    if (loginNavItemDesktop) loginNavItemDesktop.classList.remove("d-none");
    if (userInfoContainerDesktop) userInfoContainerDesktop.classList.add("d-none");

    // Mobile nav: Show login, hide user info container
    if (loginNavItemMobile) loginNavItemMobile.classList.remove("d-none");
    if (userInfoContainerMobile) userInfoContainerMobile.classList.add("d-none");
}

// Initial call to check login status
checkLoginStatus();