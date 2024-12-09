import { makeRequest } from "../../js/api/url.mjs";
import { checkLoginStatus } from "../../js/api/checkLogin.mjs";
import { buildModal } from "../../js/components/modal/modalBuilder.mjs";
import { getUSerData, setUserData } from "../../js/utility.mjs/userInfo.mjs";

// Main function to display profile using userData
window.displayUserProfile = function () {
    const loginData = getUSerData();
    const userData = loginData?.userData;

    if (!userData) {
        console.warn("No userData found in loginData");
        return;
    }

    const { name, bio = "No bio available", avatar, banner, credits, listingsCount, winsCount } = userData;

    const defaultBannerUrl = '/src/assets/images/pexels-zaksheuskaya-709412-1561020.jpg';
    const avatarHtml = avatar?.url
        ? `<img src="${avatar.url}" alt="User Avatar" class="avatar-image" width="100">`
        : `<i class="fas fa-user-circle fa-5x text-muted avatar-image"></i>`;

    const profileHTML = `
    <div class="container text-center mt-5">
        <div class="banner-container" style="position: relative;">
            <img id="bannerImage" src="${banner?.url || defaultBannerUrl}" alt="${banner?.alt || 'Profile Banner'}" class="img-fluid rounded mb-3" style="width: 100%; height: 200px; object-fit: cover;">
            <div class="profile-avatar-container">
                ${avatarHtml}
            </div>
        </div>

        <h1 class="display-4 mt-5">${name || 'No name provided'}</h1>
        <p id="bioText" class="lead text-muted">${bio}</p>
        <p class="text-muted">Credits: ${credits || 0}</p>
        <div class="d-flex justify-content-center">
            <p class="mx-3">Listings: ${listingsCount || 0}</p>
            <p class="mx-3">Wins: ${winsCount || 0}</p>
        </div>

        <button onclick="openEditProfileModal()" class="btn btn-primary mt-4">Edit Profile</button>
    </div>
    `;

    const containerElement = document.querySelector(".profile-container");
    if (containerElement) {
        containerElement.innerHTML = profileHTML;
    } else {
        console.error("No container element found to insert profile content.");
    }
};

/**
 * Opens a modal for editing the user profile.
 */
window.openEditProfileModal = function () {
    const loginData = getUSerData();
    const userData = loginData?.userData;

    if (!userData) {
        console.error("No user data available.");
        return;
    }

    const editableData = {
        bio: userData.bio || '',
        avatar: userData.avatar?.url || '',
        banner: userData.banner?.url || ''
    };

    buildModal(
        '',
        null,
        'info',
        {
            dismissible: true,
            updateData: editableData,
            onUpdate: async (updatedValues) => {
                await updateProfile(updatedValues);
            }
        },
        'update'
    );
};

/**
 * Updates the user's profile with the provided data.
 * @param {Object} updatedValues - The updated user profile data.
 */
async function updateProfile(updatedValues) {
    const loginData = getUSerData();
    const profileName = loginData?.data?.name;

    if (!profileName) {
        console.error("Profile name is missing; cannot update profile.");
        return;
    }

    const updatedData = {
        bio: updatedValues.bio || loginData.userData.bio,
        avatar: updatedValues.avatar ? { url: updatedValues.avatar, alt: "" } : loginData.userData.avatar,
        banner: updatedValues.banner ? { url: updatedValues.banner, alt: "" } : loginData.userData.banner,
    };

    try {
        await makeRequest(`profiles/${profileName}`, '', '', 'PUT', updatedData, {}, true);

        loginData.userData = { ...loginData.userData, ...updatedData };
        setUserData(loginData); // Save updated user data

        displayUserProfile(); // Refresh profile display
        checkLoginStatus(); // Update relevant areas
        window.location.reload();
    } catch (error) {
        console.error("Error updating profile:", error);
    }
}

// Initialize profile on page load
document.addEventListener("DOMContentLoaded", displayUserProfile);
