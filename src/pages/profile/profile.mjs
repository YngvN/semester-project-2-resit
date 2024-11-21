import { makeRequest, displayErrorModal } from "../../js/api/url.mjs";
import { checkLoginStatus } from "../../js/api/checkLogin.mjs";

// Helper function to get loginData from storage
function getLoginData() {
    return JSON.parse(localStorage.getItem("loginData") || sessionStorage.getItem("loginData"));
}

// Helper function to set loginData back to storage
function setLoginData(data) {
    const storage = localStorage.getItem("loginData") ? localStorage : sessionStorage;
    storage.setItem("loginData", JSON.stringify(data));
}

// Main function to display profile using userData
window.displayUserProfile = function () {
    const loginData = getLoginData();
    const userData = loginData?.userData;

    if (!userData) {
        console.warn("No userData found in loginData");
        return;
    }

    const { name, bio = "No bio available", avatar, banner, credits, listingsCount, winsCount } = userData;

    const defaultBannerUrl = '/src/assets/images/pexels-zaksheuskaya-709412-1561020.jpg';
    const avatarHtml = avatar?.url
        ? `<img src="${avatar.url}" alt="User Avatar" class="rounded-circle avatar-image" width="100">`
        : `<i class="fas fa-user-circle fa-5x text-muted avatar-image"></i>`;

    const profileHTML = `
        <div class="container text-center mt-5">
            <div class="banner-container" style="position: relative;">
                <img id="bannerImage" src="${banner?.url || defaultBannerUrl}" alt="${banner?.alt || 'Profile Banner'}" class="img-fluid rounded mb-3" style="width: 100%; height: 200px; object-fit: cover;">
                <button onclick="editBanner()" class="btn btn-primary btn-sm position-absolute top-0 end-0 mt-2 me-2">Edit</button>
                <div class="profile-avatar-container" style="position: absolute; bottom: -50px; left: 50%; transform: translateX(-50%);">
                    ${avatarHtml}
                    <button onclick="editAvatar()" class="btn btn-primary btn-sm mt-2">Edit</button>
                </div>
            </div>
            <h1 class="display-4 mt-5">${name || 'No name provided'}</h1>
            <div class="bio-container">
                <p id="bioText" class="lead text-muted">${bio}</p>
                <button onclick="editBio()" class="btn btn-primary btn-sm">Edit</button>
            </div>
            <p class="text-muted">Credits: ${credits || 0}</p>
            <div class="d-flex justify-content-center">
                <p class="mx-3">Listings: ${listingsCount || 0}</p>
                <p class="mx-3">Wins: ${winsCount || 0}</p>
            </div>
        </div>
    `;

    const containerElement = document.querySelector(".profile-container");
    if (containerElement) {
        containerElement.innerHTML = profileHTML;
    } else {
        console.error("No container element found to insert profile content.");
    }
};

// Editing functions
window.editBio = function () {
    const bioContainer = document.querySelector(".bio-container");
    const bioText = document.getElementById("bioText").textContent;
    bioContainer.innerHTML = `
        <textarea id="bioInput" class="form-control mb-2">${bioText}</textarea>
        <button onclick="saveBio()" class="btn btn-success btn-sm">Save</button>
        <button onclick="cancelEditBio()" class="btn btn-secondary btn-sm">Cancel</button>
    `;
};

window.editAvatar = function () {
    const avatarContainer = document.querySelector(".profile-avatar-container");
    avatarContainer.innerHTML = `
        <input id="avatarInput" type="url" class="form-control mb-2" placeholder="Enter avatar URL">
        <button onclick="saveAvatar()" class="btn btn-success btn-sm">Save</button>
        <button onclick="displayUserProfile()" class="btn btn-secondary btn-sm">Cancel</button>
    `;
};

window.editBanner = function () {
    const bannerContainer = document.querySelector(".banner-container");
    const bannerImage = document.getElementById("bannerImage").src;
    bannerContainer.innerHTML = `
        <input id="bannerInput" type="url" class="form-control mb-2" placeholder="Enter banner URL" value="${bannerImage}">
        <button onclick="saveBanner()" class="btn btn-success btn-sm">Save</button>
        <button onclick="displayUserProfile()" class="btn btn-secondary btn-sm">Cancel</button>
    `;
};

// Function to cancel bio edit
window.cancelEditBio = function () {
    const bioContainer = document.querySelector(".bio-container");
    bioContainer.innerHTML = `
        <p id="bioText" class="lead text-muted">${getLoginData().userData.bio || "No bio available"}</p>
        <button onclick="editBio()" class="btn btn-primary btn-sm">Edit</button>
    `;
};

// Generic function to handle profile updates
async function updateProfile(data) {
    const loginData = getLoginData();
    const profileName = loginData?.data?.name;

    if (!profileName) {
        console.error("Profile name is missing; cannot update profile.");
        return;
    }

    try {
        await makeRequest(`profiles/${profileName}`, '', '', 'PUT', data, {}, true);

        loginData.userData = { ...loginData.userData, ...data };
        if (data.avatar) loginData.userData.avatar = { ...loginData.userData.avatar, ...data.avatar };
        if (data.banner) loginData.userData.banner = { ...loginData.userData.banner, ...data.banner };

        setLoginData(loginData); // Save updated loginData

        displayUserProfile(); // Refresh profile display
        checkLoginStatus(); // Update any relevant areas
    } catch (error) {
        console.error("Error updating profile:", error);
    }
}

// Functions to save changes
window.saveBio = function () {
    const bio = document.getElementById("bioInput").value;
    updateProfile({ bio });
};

window.saveAvatar = function () {
    const avatarUrl = document.getElementById("avatarInput").value;
    updateProfile({ avatar: { url: avatarUrl, alt: "" } });
};

window.saveBanner = function () {
    const bannerUrl = document.getElementById("bannerInput").value;
    updateProfile({ banner: { url: bannerUrl, alt: "" } });
};

// Initialize profile on page load
document.addEventListener("DOMContentLoaded", displayUserProfile);
