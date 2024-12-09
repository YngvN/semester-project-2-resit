import { displayMessage } from "./modalMessage.mjs";
import { buildModalListing } from "./modalListing.mjs";
import { revealElement, hideElement } from "../../animation/fade.mjs";
import { makeRequest } from "../../api/url.mjs";
import { createNewListingModal } from "./modalCreateListing.mjs";
import { buildUpdateModal } from "./modalUpdateUSer.mjs";

let modalCount = 1;

/**
 * Builds and displays a modal.
 * @param {string} listingId - The ID of the listing to fetch and display. (Optional for 'create' modal)
 * @param {string|null} message - Optional message to display in the modal.
 * @param {string} messageType - The type of message (e.g., "info", "success", "error"). Defaults to "info".
 * @param {Object} options - Additional options for customizing the modal.
 * @param {boolean} options.dismissible - Whether the modal can be dismissed. Defaults to true.
 * @param {string} modalType - Specifies the type of modal ('create' for new listing, 'display' for existing listing).
 */
export async function buildModal(
    listingId = '',
    message = null,
    messageType = "info",
    options = { dismissible: true, updateData: null, onUpdate: null },
    modalType = 'display'
) {
    // Validate options
    options = options || {};
    const { dismissible = true, updateData = null, onUpdate = null } = options;

    let listingData = null;

    if (modalType === 'display' && listingId) {
        // Fetch listing data if listingId is provided
        try {
            listingData = await makeRequest(
                `listings/${listingId}`,
                '',
                '',
                'GET',
                null,
                { _seller: true, _bids: true },
                false
            );
        } catch (error) {
            console.error(`Failed to fetch listing data for ID ${listingId}:`, error);
            await displayMessage(document.body, "Failed to load listing data. Please try again.", "error");
            return;
        }
    }

    // Get the modal-container element
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) {
        console.error("Modal container not found. Ensure an element with id 'modal-container' exists.");
        return;
    }

    // Clear any existing content in the modal-container
    modalContainer.innerHTML = '';

    // Create the modal structure
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('role', 'dialog');
    modal.style.display = 'none'; // Start hidden for fade-in effect

    const modalDialog = document.createElement('div');
    modalDialog.className = 'modal-dialog';
    modalDialog.setAttribute('role', 'document');

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.setAttribute('data-modal-instance', modalCount++);
    if (listingId) modalContent.setAttribute('id', listingId);

    // Append the modal structure together
    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);
    modalContainer.appendChild(modal);

    if (message) {
        // Display a message if provided
        await displayMessage(modalContent, message, messageType);
    } else if (modalType === 'display' && listingData) {
        // Pass the fetched listing data to buildModalListing
        buildModalListing(modalContent.getAttribute('data-modal-instance'), listingData);
    } else if (modalType === 'create') {
        // Build the create listing modal
        createNewListingModal(modalContent);
    } else if (modalType === 'update') {
        if (!updateData) {
            console.warn("No updateData provided for update modal.");
            return;
        }
        // Pass the update data and the onUpdate callback to buildUpdateModal
        buildUpdateModal(modalContent, updateData, onUpdate);
    }

    // Fade in the modal
    try {
        await revealElement(modal);
    } catch (error) {
        console.error("Failed to reveal the modal:", error);
    }

    // Add event listener to close the modal with fade-out if dismissible
    if (dismissible) {
        modal.addEventListener('click', async (e) => {
            if (e.target === modal) {
                try {
                    await hideElement(modal);
                } catch (error) {
                    console.error("Failed to hide the modal:", error);
                } finally {
                    modal.remove(); // Clean up the DOM after hiding
                }
            }
        });
    }

    const closeButton = modal.querySelector('.close');
    if (closeButton) {
        closeButton.addEventListener('click', async () => {
            try {
                await hideElement(modal);
            } catch (error) {
                console.error("Failed to hide the modal:", error);
            } finally {
                modal.remove(); // Clean up the DOM after hiding
            }
        });
    }
}


/**
 * Creates a modal header with a title and a close button.
 * @param {string} title - The title to display in the modal header.
 * @param {Function} onClose - The callback function to execute when the close button is clicked.
 * @returns {HTMLElement} The modal header element.
 */
export function createModalHeader(title, onClose) {
    // Create the modal-header container
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';

    // Create the title element
    const modalTitle = document.createElement('h5');
    modalTitle.className = 'modal-title';
    modalTitle.textContent = title;

    // Create the close button
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'close';
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.innerHTML = `
        <span class="line line-1" aria-hidden="true"></span>
        <span class="line line-2" aria-hidden="true"></span>
    `;

    // Attach the onClose callback to the close button
    closeButton.addEventListener('click', onClose);

    // Append title and close button to modal-header
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    return modalHeader;
}
