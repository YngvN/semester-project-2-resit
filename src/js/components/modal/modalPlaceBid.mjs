import { hideElement, revealElement } from "../../animation/fade.mjs";
import { makeRequest } from "../../api/url.mjs";
import { buildModal } from "./modalBuilder.mjs";
import { showConfirmationModal } from "./modalConfirmation.mjs";


/**
 * Builds and displays the Place Bid view.
 * @param {HTMLElement} modalContent - The modal content container.
 * @param {string} modalInstance - The unique modal instance identifier.
 * @param {number} availableCredits - The user's available credits for bidding.
 * @param {number} highestBid - The current highest bid for the listing.
 * @param {string} listingTitle - Listing title.
 */
export function placeBid(modalContent, modalInstance, availableCredits, highestBid, listingTitle) {
    // Validate modalContent
    if (!modalContent) {
        console.error("Invalid modalContent element provided.");
        return;
    }

    console.log(listingTitle);

    // Select or create the Place Bid root container
    let bodyPlaceBid = modalContent.querySelector("#body-placeBid");
    let isNewView = false;

    if (!bodyPlaceBid) {
        bodyPlaceBid = document.createElement("div");
        bodyPlaceBid.id = "body-placeBid";
        isNewView = true;
    }

    // Clear existing content in bodyPlaceBid
    bodyPlaceBid.innerHTML = "";

    // Create modal-body
    const modalBody = document.createElement("div");
    modalBody.className = "modal-body";

    // Create a container for the bid form
    const bidContainer = document.createElement("div");
    bidContainer.className = "listings-container";

    // Display available credits and highest bid
    const infoContainer = document.createElement("div");
    infoContainer.className = "info-container";

    const availableCreditsDisplay = document.createElement("p");
    availableCreditsDisplay.className = "credits-display";
    availableCreditsDisplay.innerHTML = `Available Credits: <span id="available-credits">$${availableCredits}</span>`;

    const highestBidDisplay = document.createElement("p");
    highestBidDisplay.className = "highest-bid-display";

    if (highestBid === null || highestBid === undefined) {
        highestBidDisplay.innerHTML = `No Bids Yet`;
    } else {
        highestBidDisplay.innerHTML = `Current Highest Bid: <span id="highest-bid">$${highestBid}</span>`;
    }

    infoContainer.appendChild(availableCreditsDisplay);
    infoContainer.appendChild(highestBidDisplay);
    bidContainer.appendChild(infoContainer);

    const bidForm = document.createElement("form");
    bidForm.id = "place-bid-form";
    bidForm.setAttribute("aria-labelledby", "placeBidTitle");

    // Create input for bid amount
    const inputRow = document.createElement("div");
    inputRow.className = "listings-row";

    const label = document.createElement("label");
    label.setAttribute("for", "bid-amount");
    label.className = "listings-column listings-username-header";
    label.textContent = "Bid Amount:";

    const input = document.createElement("input");
    input.type = "number";
    input.id = "bid-amount";
    input.name = "bid-amount";
    input.min = highestBid + 1; // Minimum bid is 1 unit higher than the current highest bid
    input.max = availableCredits;
    input.className = "listings-column listings-amount";
    input.required = true;

    inputRow.appendChild(label);
    inputRow.appendChild(input);
    bidForm.appendChild(inputRow);

    // Create button container
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "modal-footer";

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className = "btn btn-primary";
    submitButton.textContent = "Submit Bid";

    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "btn-back btn btn-secondary";
    backButton.textContent = "Back";

    buttonContainer.appendChild(submitButton);
    buttonContainer.appendChild(backButton);

    // Append the button container to the form
    bidForm.appendChild(buttonContainer);

    // Append the bid form to the bid container
    bidContainer.appendChild(bidForm);

    // Append the bid container to the modal-body
    modalBody.appendChild(bidContainer);

    // Append the modal-body to bodyPlaceBid
    bodyPlaceBid.appendChild(modalBody);

    // Append bodyPlaceBid to modalContent if it's new
    if (isNewView) {
        modalContent.appendChild(bodyPlaceBid);
    }

    // Add event listener for bid submission
    bidForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const bidAmount = parseInt(input.value, 10);

        if (isNaN(bidAmount) || bidAmount <= highestBid || bidAmount > availableCredits) {
            buildModal(null, "Invalid bid amount. Ensure it's higher than the current bid and within your credits.", "error", { dismissible: true });
            return;
        }

        // Retrieve the id of the parent container (modalContent)
        const listingId = modalContent.getAttribute("id");
        if (!listingId) {
            buildModal(null, "Listing ID not found. Please refresh and try again.", "error", { dismissible: true });
            return;
        }

        try {

            showConfirmationModal(modalContent, listingTitle, listingId, bidAmount, availableCredits, bodyPlaceBid)
        } catch (error) {
            buildModal(null, "Failed to place bid. Please try again.", "error", { dismissible: true });
            console.error("Bid placement error:", error);
        }
    });

    // Add event listener for Back button
    backButton.addEventListener("click", () => {
        hideElement(bodyPlaceBid);
        const bodyListing = modalContent.querySelector("#body-listing");
        if (bodyListing) {
            revealElement(bodyListing);
        }
    });

    // Show the Place Bid view
    revealElement(bodyPlaceBid);
}