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

(function checkLoginStatus() {
    const storedLoginData = localStorage.getItem("loginData") || sessionStorage.getItem("loginData");
    const loginData = storedLoginData ? JSON.parse(storedLoginData).data : null;

    const loginLink = document.getElementById("loginLink");
    const navAvatar = document.getElementById("navAvatar");
    const navAvatarPlaceholder = document.getElementById("navAvatarPlaceholder");
    const usernameDisplay = document.getElementById("usernameDisplay");
    const myAuctionsLink = document.getElementById("myAuctionsLink");
    const profileDropdownContainer = document.getElementById("profileDropdownContainer");
    const loginNavItem = document.getElementById("loginNavItem");

    // Define user array based on loginData properties if loginData exists
    let user = [];
    if (loginData) {
        user = [
            { key: "name", value: loginData.name || "Unknown User" },
            { key: "email", value: loginData.email || "No email provided" },
            { key: "credits", value: loginData.credits || 0 },
            { key: "avatarURL", value: loginData.avatar?.url || "No avatar URL provided" },
            { key: "listingsCount", value: loginData._count?.listings || 0 },
            { key: "winsCount", value: loginData._count?.wins || 0 }
        ];

        // Hide login button and show profile dropdown
        loginNavItem.classList.add("d-none");
        profileDropdownContainer.classList.remove("d-none");

        // Show avatar or placeholder in navbar
        if (loginData.avatar && loginData.avatar.url) {
            navAvatar.src = loginData.avatar.url;
            navAvatar.alt = loginData.avatar.alt || "User avatar";
            navAvatar.classList.remove("d-none");
            navAvatarPlaceholder.classList.add("d-none");
        } else {
            navAvatar.classList.add("d-none");
            navAvatarPlaceholder.classList.remove("d-none");
        }

        // Display username in the dropdown
        usernameDisplay.textContent = loginData.name || "Unknown User";

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

    console.log("User Array:", user); // Logs the array for debugging or further use
})();

