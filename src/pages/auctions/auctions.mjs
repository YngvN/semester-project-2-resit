
import { makeRequest, displayErrorModal } from "../../js/api/url.mjs";
import { buildListingTiles } from "../../js/components/buildTiles.mjs";
import { revealElement, hideElement } from "../../js/animation/fade.mjs";
import { initCreateListingForm } from "./createListing.mjs";

document.addEventListener("DOMContentLoaded", async () => {
    console.log("auctions.mjs loaded");

    initCreateListingForm();

    // Retrieve the username from stored login data
    const loginData = JSON.parse(localStorage.getItem("loginData")) || JSON.parse(sessionStorage.getItem("loginData"));
    const profileName = loginData && loginData.userData ? loginData.userData.name : null;

    if (!profileName) {
        console.error("Profile name not found in login data.");
        displayErrorModal("Unable to load user-specific content. Please log in again.");
        return;
    }

    // Containers for each type of listing data
    const myListingsContainer = document.getElementById("myListingsContainer");
    const myBidsContainer = document.getElementById("myBidsContainer");
    const myWinsContainer = document.getElementById("myWinsContainer");

    // Buttons for each container
    const myListingsButton = document.getElementById("myListingsButton");
    const myBidsButton = document.getElementById("myBidsButton");
    const myWinsButton = document.getElementById("myWinsButton");

    // Load all data once on initial page load
    try {
        await Promise.all([
            buildListingTiles("published", profileName, "listings-tiles-row"),
            buildListingTiles("bids", profileName, "bids-tiles-row"),
            buildListingTiles("wins", profileName, "wins-tiles-row"),
        ]);
        console.log("All listing data loaded and containers populated.");
    } catch (error) {
        console.error("Error loading initial listing data:", error);
        displayErrorModal("Error loading initial data. Please refresh and try again.");
        return;
    }

    // Event listeners for buttons to reveal/hide preloaded containers and set active button
    myListingsButton.addEventListener("click", () => {
        showContainer(myListingsContainer, myListingsButton);
    });

    myBidsButton.addEventListener("click", () => {
        showContainer(myBidsContainer, myBidsButton);
    });

    myWinsButton.addEventListener("click", () => {
        showContainer(myWinsContainer, myWinsButton);
    });

    // Function to hide all containers, reveal the specified one, and set active button
    function showContainer(containerToShow, activeButton) {
        hideElement(myListingsContainer);
        hideElement(myBidsContainer);
        hideElement(myWinsContainer);
        revealElement(containerToShow);

        // Remove 'active' class from all buttons
        myListingsButton.classList.remove("active");
        myBidsButton.classList.remove("active");
        myWinsButton.classList.remove("active");

        activeButton.classList.add("active");
    }

    // Event listener to remove all modal backdrops when a modal is hidden
    document.addEventListener("hidden.bs.modal", () => {
        document.querySelectorAll(".modal-backdrop").forEach((backdrop) => backdrop.remove());
    });

    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("modal")) {
            document.querySelectorAll(".modal-backdrop").forEach((backdrop) => backdrop.remove());
        }
    });
});

