// (function checkLoginStatus() {
//     const storedLoginData = localStorage.getItem("loginData") || sessionStorage.getItem("loginData");
//     const loginData = storedLoginData ? JSON.parse(storedLoginData).data : null;

//     const loginLink = document.getElementById("loginLink");
//     const navAvatar = document.getElementById("navAvatar");
//     const navAvatarPlaceholder = document.getElementById("navAvatarPlaceholder");
//     const usernameDisplay = document.getElementById("usernameDisplay");
//     const myAuctionsLink = document.getElementById("myAuctionsLink");
//     const profileDropdownContainer = document.getElementById("profileDropdownContainer");
//     const loginNavItem = document.getElementById("loginNavItem");

//     if (loginData) {
//         // Hide login button and show profile dropdown
//         loginNavItem.classList.add("d-none");
//         profileDropdownContainer.classList.remove("d-none");

//         // Show avatar or placeholder in navbar
//         if (loginData.avatar && loginData.avatar.url) {
//             navAvatar.src = loginData.avatar.url;
//             navAvatar.alt = loginData.avatar.alt || "User avatar";
//             navAvatar.classList.remove("d-none");
//             navAvatarPlaceholder.classList.add("d-none");
//         } else {
//             navAvatar.classList.add("d-none");
//             navAvatarPlaceholder.classList.remove("d-none");
//         }

//         // Display username and credits in the dropdown
//         usernameDisplay.textContent = loginData.name || "Unknown User";

//     } else {
//         // Hide "My Auctions" and profile dropdown, show login button
//         myAuctionsLink.style.display = 'none';
//         profileDropdownContainer.classList.add("d-none");
//         loginNavItem.classList.remove("d-none");
//     }

//     // Log out functionality
//     document.getElementById("logout").addEventListener("click", function () {
//         localStorage.removeItem("loginData");
//         sessionStorage.removeItem("loginData");
//         location.reload();
//     });
// })();

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

            // Update loginData with structured userData
            const loginData = JSON.parse(localStorage.getItem("loginData") || sessionStorage.getItem("loginData"));
            loginData.userData = userData;

            // Save back to storage
            if (localStorage.getItem("loginData")) {
                localStorage.setItem("loginData", JSON.stringify(loginData));
            } else {
                sessionStorage.setItem("loginData", JSON.stringify(loginData));
            }

            console.log("Updated Login Data with Detailed User Data:", loginData);
            return userData;
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
    }
    return null;
}


export default fetchUserProfile;

export function checkLoginStatus() {
    const storedLoginData = localStorage.getItem("loginData") || sessionStorage.getItem("loginData");
    const loginData = storedLoginData ? JSON.parse(storedLoginData) : null;

    const loginLink = document.getElementById("loginLink");
    const navAvatar = document.getElementById("navAvatar");
    const navAvatarPlaceholder = document.getElementById("navAvatarPlaceholder");
    const usernameDisplay = document.getElementById("usernameDisplay");
    const myAuctionsLink = document.getElementById("myAuctionsLink");
    const profileDropdownContainer = document.getElementById("profileDropdownContainer");
    const loginNavItem = document.getElementById("loginNavItem");

    if (loginData && loginData.data) {
        // Use the detailed user data from `userData` if available
        const userData = loginData.userData || loginData.data;
        const { name, email, credits, avatar, listingsCount, winsCount } = userData;

        // Hide login button and show profile dropdown
        loginNavItem.classList.add("d-none");
        profileDropdownContainer.classList.remove("d-none");

        // Show avatar or placeholder in the navbar using userData
        if (avatar && avatar.url) {
            navAvatar.src = avatar.url;
            navAvatar.alt = avatar.alt || "User avatar";
            navAvatar.classList.remove("d-none");
            navAvatarPlaceholder.classList.add("d-none");
        } else {
            navAvatar.classList.add("d-none");
            navAvatarPlaceholder.classList.remove("d-none");
        }

        // Display username in the dropdown
        usernameDisplay.textContent = name || "Unknown User";

        // Fetch additional user profile details and update `userData`
        fetchUserProfile(name).then(profile => {
            if (profile) {
                loginData.userData = profile;

                // Store updated loginData back to localStorage or sessionStorage
                if (localStorage.getItem("loginData")) {
                    localStorage.setItem("loginData", JSON.stringify(loginData));
                } else {
                    sessionStorage.setItem("loginData", JSON.stringify(loginData));
                }

                // Update the avatar again after fetch in case it changed
                const updatedAvatar = profile.avatar;
                if (updatedAvatar && updatedAvatar.url) {
                    navAvatar.src = updatedAvatar.url;
                    navAvatar.alt = updatedAvatar.alt || "User avatar";
                    navAvatar.classList.remove("d-none");
                    navAvatarPlaceholder.classList.add("d-none");
                }
            }
        });
    } else {
        // Hide "My Auctions" and profile dropdown, show login button
        myAuctionsLink.style.display = 'none';
        profileDropdownContainer.classList.add("d-none");
        loginNavItem.classList.remove("d-none");
    }

    // Log out functionality
    document.getElementById("logout").addEventListener("click", function () {
        localStorage.removeItem("loginData");
        sessionStorage.removeItem("loginData");
        location.reload();
    });
}

checkLoginStatus();
