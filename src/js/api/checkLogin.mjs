import { makeRequest } from "./url.mjs";
import updateNavigationUI from "../components/navbar/navLoggedIn.mjs";

/**
 * Fetches detailed user data based on the profile name.
 * @param {string} profileName - The profile name (username) to search for.
 * @returns {object|null} - The user profile data if successful, otherwise null.
 */
async function fetchUserProfile(profileName) {
    try {
        const result = await makeRequest("profiles", profileName, '', 'GET', null, {}, true);
        if (result && result.data) {
            const profileData = result.data;

            return {
                name: profileData.name,
                email: profileData.email,
                credits: profileData.credits,
                avatar: profileData.avatar || { url: "", alt: "No avatar available" },
                banner: profileData.banner || { url: "", alt: "No banner available" },
                bio: profileData.bio || "No bio available",
                listingsCount: profileData._count?.listings || 0,
                winsCount: profileData._count?.wins || 0
            };
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
    }
    return null;
}

/**
 * Checks login status, updates the UI, and handles logout.
 */
export async function checkLoginStatus() {
    const storedLoginData = localStorage.getItem("loginData") || sessionStorage.getItem("loginData");
    const loginData = storedLoginData ? JSON.parse(storedLoginData) : null;
    const profileName = loginData?.userData?.name || loginData?.data?.name;

    if (!profileName) {
        updateNavigationUI(false); // Display logged-out state
        return;
    }

    const userData = await fetchUserProfile(profileName);

    if (userData) {
        // Update loginData with userData and save to storage
        loginData.userData = userData;
        localStorage.setItem("loginData", JSON.stringify(loginData));

        // Update the UI for logged-in state
        updateNavigationUI(true, userData);
    } else {
        // Display logged-out state if fetching user data fails
        updateNavigationUI(false);
    }

    // Attach logout functionality to logout buttons
    document.querySelectorAll("#logout").forEach(button => {
        if (!button.hasAttribute("data-listener")) {
            button.addEventListener("click", () => {
                localStorage.removeItem("loginData");
                sessionStorage.removeItem("loginData");
                location.reload();
            });
            button.setAttribute("data-listener", "true"); // Prevent multiple listeners
        }
    });
}

// Initial call to check login status
checkLoginStatus();
