import { hideElement, revealElement } from "../../animation/fade.mjs";
import { makeRequest } from "../../api/url.mjs";
import { buildModal } from "./modalBuilder.mjs";

/**
 * Displays a confirmation modal for the bid.
 * @param {HTMLElement} modalContent - The modal content container.
 * @param {string} listingId - The unique modal instance 
 * @param {string} listingTitle - Listing title.
 * @param {number} bidAmount - The amount the user is bidding.
 * @param {number} availableCredits - The user's available credits.
 * @param {HTMLElement} bodyPlaceBid - The Place Bid modal to hide.
 */
export function showConfirmationModal(modalContent, listingTitle, listingId, bidAmount, availableCredits, bodyPlaceBid) {
    let confirmationModal = modalContent.querySelector('#confirmation-modal');

    if (!confirmationModal) {
        confirmationModal = document.createElement('div');
        confirmationModal.id = 'confirmation-modal';
        confirmationModal.className = 'modal-body';
        confirmationModal.style.display = 'none';
        modalContent.appendChild(confirmationModal);
    }

    // Hide the Place Bid modal
    hideElement(bodyPlaceBid);

    confirmationModal.innerHTML = `
        <div class="body-confirmation">
            <h3>Confirm Your Bid</h3>
            <p>You're bidding on: ${listingTitle}</p>
            <p>Bid Amount: <strong>$${bidAmount}</strong></p>
            <p>Available Credits After Bid: <strong>$${availableCredits - bidAmount}</strong></p>
            <div class="modal-footer">
                <button id="confirm-bid" class="btn btn-primary">Are you sure?</button>
                <button id="cancel-bid" class="btn btn-secondary">Cancel</button>
            </div>
        </div>
    `;

    // Event listener for "Confirm" button
    confirmationModal.querySelector('#confirm-bid').addEventListener('click', async () => {

        // Submit the bid using makeRequest
        const response = await makeRequest("listings", listingId, "bids", "POST", { amount: bidAmount });
        buildModal(null, `Bid of $${bidAmount} placed successfully!`, "success", { dismissible: true });

    });

    // Event listener for "Cancel" button
    confirmationModal.querySelector('#cancel-bid').addEventListener('click', () => {

        const modal = document.getElementsByClassName('.modal');

        hideElement(confirmationModal);
        // Show the Place Bid modal again
        revealElement(bodyPlaceBid);
    });

    // Show the confirmation modal
    revealElement(confirmationModal);
}
