import { makeRequest } from "../../js/api/url.mjs";

// Main function to display profile
async function displayUserProfile() {
    const loginData = JSON.parse(localStorage.getItem("loginData") || sessionStorage.getItem("loginData"));
    const profileName = loginData?.data?.name;

    if (!profileName) {
        console.warn("No loginData found or missing profile name");
        return; // Exit if no user is logged in or no profile name
    }

    try {
        const profileResponse = await makeRequest(`profiles/${profileName}`, '', '', 'GET');
        const profileData = profileResponse.data;

        const { name, bio = "No bio available", avatar, banner, credits, _count } = profileData;

        // Placeholder image URLs
        const defaultBannerUrl = '/src/assets/images/pexels-zaksheuskaya-709412-1561020.jpg';
        const avatarHtml = avatar?.url
            ? `<img src="${avatar.url}" alt="User Avatar" class="rounded-circle avatar-image" width="100">`
            : `<i class="fas fa-user-circle fa-5x text-muted avatar-image"></i>`;

        // Build profile HTML with edit buttons
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
                    <p class="mx-3">Listings: ${_count?.listings || 0}</p>
                    <p class="mx-3">Wins: ${_count?.wins || 0}</p>
                </div>
            </div>
        `;

        const containerElement = document.querySelector(".profile-container");
        if (containerElement) {
            containerElement.innerHTML = profileHTML;
        } else {
            console.error("No container element found to insert profile content.");
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
    }
}

// Functions to handle editing and saving for bio, avatar, and banner
window.editBio = function () {
    const bioContainer = document.querySelector(".bio-container");
    const bioText = document.getElementById("bioText").textContent;
    bioContainer.innerHTML = `
        <textarea id="bioInput" class="form-control mb-2">${bioText}</textarea>
        <button onclick="saveBio()" class="btn btn-success btn-sm">Save</button>
        <button onclick="displayUserProfile()" class="btn btn-secondary btn-sm">Cancel</button>
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

// Functions to handle saving updated bio, avatar, and banner
window.saveBio = async function () {
    const bio = document.getElementById("bioInput").value;
    const loginData = JSON.parse(localStorage.getItem("loginData") || sessionStorage.getItem("loginData"));
    const profileName = loginData?.data?.name;
    const token = loginData?.data?.accessToken;

    await makeRequest(`profiles/${profileName}`, '', '', 'PUT', { bio }, { Authorization: `Bearer ${token}` });
    displayUserProfile();
};

window.saveAvatar = async function () {
    const avatarUrl = document.getElementById("avatarInput").value;
    const loginData = JSON.parse(localStorage.getItem("loginData") || sessionStorage.getItem("loginData"));
    const profileName = loginData?.data?.name;
    const token = loginData?.data?.accessToken;

    await makeRequest(`profiles/${profileName}`, '', '', 'PUT', { avatar: { url: avatarUrl, alt: "" } }, { Authorization: `Bearer ${token}` });
    displayUserProfile();
};

window.saveBanner = async function () {
    const bannerUrl = document.getElementById("bannerInput").value;
    const loginData = JSON.parse(localStorage.getItem("loginData") || sessionStorage.getItem("loginData"));
    const profileName = loginData?.data?.name;
    const token = loginData?.data?.accessToken;

    await makeRequest(`profiles/${profileName}`, '', '', 'PUT', { banner: { url: bannerUrl, alt: "" } }, { Authorization: `Bearer ${token}` });
    displayUserProfile();
};

// Run displayUserProfile on page load
document.addEventListener("DOMContentLoaded", displayUserProfile);
console.log("profile.mjs loaded");
