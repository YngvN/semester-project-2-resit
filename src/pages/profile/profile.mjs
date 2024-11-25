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

    <!-- Modal Structure -->
    <div id="editProfileModal" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Profile</h5>
                    <button type="button" class="close-btn" data-bs-dismiss="modal" aria-label="Close">
                        <span
                            aria-hidden="true">&times;
                        </span>
                    </button>                
                </div>
                <div class="modal-body">
                    <form id="editProfileForm">
                        <div class="mb-3">
                            <label for="editName" class="form-label">Name</label>
                            <input type="text" class="form-control" id="editName" value="${name || ''}">
                        </div>
                        <div class="mb-3">
                            <label for="editBio" class="form-label">Bio</label>
                            <textarea class="form-control" id="editBio">${bio}</textarea>
                        </div>
                        <div class="mb-3">
                            <label for="editAvatar" class="form-label">Avatar URL</label>
                            <input type="url" class="form-control" id="editAvatar" value="${avatar?.url || ''}">
                        </div>
                        <div class="mb-3">
                            <label for="editBanner" class="form-label">Banner URL</label>
                            <input type="url" class="form-control" id="editBanner" value="${banner?.url || ''}">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button onclick="saveProfileChanges()" class="btn btn-success">Save Changes</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                </div>
            </div>
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

window.openEditProfileModal = function () {
    const modalElement = document.getElementById("editProfileModal");
    const bootstrapModal = new bootstrap.Modal(modalElement);
    bootstrapModal.show();
};

window.saveProfileChanges = function () {
    const name = document.getElementById("editName").value;
    const bio = document.getElementById("editBio").value;
    const avatarUrl = document.getElementById("editAvatar").value;
    const bannerUrl = document.getElementById("editBanner").value;

    const updatedData = {
        name,
        bio,
        avatar: { url: avatarUrl },
        banner: { url: bannerUrl },
    };

    updateProfile(updatedData);
    const modalElement = document.getElementById("editProfileModal");
    const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
    bootstrapModal.hide();
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
