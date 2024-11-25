import { makeRequest, displayErrorModal } from "../../api/url.mjs";
import { checkLoginStatus } from "../../api/checkLogin.mjs";
import { openListingModal } from "./listingModal.mjs";
import { revealElement, hideElement } from "../../animation/fade.mjs";


/**
 * Displays the bid history modal with all previous bids for a listing.
 * @param {Array} bids - Array of bid objects to display in the modal.
 */
export function viewBidHistory(bids) {
    const listingModal = document.getElementById('listingModal');
    if (listingModal) {
        hideElement(listingModal);
    }

    const bidHistoryModal = document.createElement('div');
    bidHistoryModal.className = 'modal fade';
    bidHistoryModal.id = 'bidHistoryModal';
    bidHistoryModal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Bid History</h5>
                    <button type="button" class="close-btn" data-bs-dismiss="modal" aria-label="Close">
                        <span
                            aria-hidden="true">&times;
                        </span>
                    </button>                         
                </div>
                <div class="modal-body">
                    ${bids.length > 0
            ? `
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Bidder</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${bids
                .map(
                    (bid) => `
                                        <tr>
                                            <td>${bid.bidder.name || 'Anonymous'}</td>
                                            <td>$${bid.amount}</td>
                                        </tr>
                                    `
                )
                .join('')}
                        </tbody>
                    </table>
                `
            : '<p>No bids available.</p>'
        }
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(bidHistoryModal);

    const bidHistoryModalInstance = new bootstrap.Modal(document.getElementById('bidHistoryModal'));
    bidHistoryModalInstance.show();

    bidHistoryModalInstance._element.addEventListener('hidden.bs.modal', () => {
        bidHistoryModalInstance.dispose();
        bidHistoryModal.remove();
        if (listingModal) {
            revealElement(listingModal);
        }
    });
}


export function openBidPopup(listingId) {
    const listingModal = document.getElementById('listingModal');
    if (listingModal) {
        hideElement(listingModal);
    }

    const loginData = JSON.parse(localStorage.getItem('loginData') || sessionStorage.getItem('loginData') || '{}');
    const availableCredits = loginData?.userData?.credits || 0;

    const bidPopup = document.createElement('div');
    bidPopup.className = 'modal fade';
    bidPopup.id = 'bidPopupModal';
    bidPopup.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Place Your Bid</h5>
                    <button type="button" class="close-btn" data-bs-dismiss="modal" aria-label="Close">
                        <span
                            aria-hidden="true">&times;
                        </span>
                    </button>                
                </div>
                <div class="modal-body">
                    <p><strong>Available Credits:</strong> $${availableCredits}</p>
                    <div class="form-group">
                        <label for="bidAmount">Enter your bid:</label>
                        <input type="number" id="bidAmount" class="form-control" placeholder="Your bid amount" min="1" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" id="submitBid" class="btn btn-primary">Submit Bid</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(bidPopup);

    const bidPopupModal = new bootstrap.Modal(document.getElementById('bidPopupModal'));
    bidPopupModal.show();

    const submitBidButton = document.getElementById('submitBid');
    submitBidButton.removeEventListener('click', handleBidSubmission);
    submitBidButton.addEventListener('click', () => handleBidSubmission(listingId));

    bidPopupModal._element.addEventListener('hidden.bs.modal', () => {
        bidPopupModal.dispose();
        bidPopup.remove();
        if (listingModal) {
            revealElement(listingModal);
        }
    });
}


export async function handleBidSubmission(listingId) {
    const bidAmount = parseFloat(document.getElementById('bidAmount').value);
    const loginData = JSON.parse(localStorage.getItem('loginData') || sessionStorage.getItem('loginData') || '{}');
    const availableCredits = loginData?.userData?.credits || 0;

    if (isNaN(bidAmount) || bidAmount <= 0) {
        displayErrorModal('Please enter a valid bid amount.');
        return;
    }

    if (bidAmount > availableCredits) {
        displayErrorModal('Insufficient credits.');
        return;
    }

    try {
        const bidResponse = await placeBid(listingId, bidAmount);
        if (bidResponse) {
            console.log(`Bid of $${bidAmount} placed successfully!`);
            bootstrap.Modal.getInstance(document.getElementById('bidPopupModal')).hide();

            // Refresh the listing modal
            await openListingModal(listingId);

            // Update the UI for the listing tile
            updateListingTile(listingId, bidAmount);

            // Refresh user session data (e.g., credits)
            await checkLoginStatus();
        } else {
            displayErrorModal("There was an issue placing your bid. Please try again.");
        }
    } catch (error) {
        displayErrorModal(`An error occurred: ${error.message}`);
    }
}


/**
 * Updates the tile or UI element representing the listing with the new highest bid.
 * @param {string} listingId - The ID of the listing to update.
 * @param {number} bidAmount - The amount of the new bid.
 */
function updateListingTile(listingId, bidAmount) {
    const listingTile = document.querySelector(`[data-listing-id="${listingId}"]`);
    if (listingTile) {
        const bidCountElement = listingTile.querySelector('.bid-count');
        const highestBidElement = listingTile.querySelector('.highest-bid');

        // Update the bid count and highest bid elements
        if (bidCountElement) {
            const currentBidCount = parseInt(bidCountElement.textContent, 10) || 0;
            bidCountElement.textContent = `${currentBidCount + 1} bids`;
        }

        if (highestBidElement) {
            highestBidElement.textContent = `$${bidAmount}`;
        }
    }
}


/**
 * Places a bid on a specific listing.
 * @async
 * @param {string} listingId - The ID of the listing to place the bid on.
 * @param {number} amount - The amount to bid.
 * @returns {Promise<object|null>} - Returns the response object or null if the bid fails.
 */
export async function placeBid(listingId, amount) {
    if (typeof amount !== "number" || amount <= 0) {
        console.error("Invalid bid amount. It must be a positive number.");
        return null;
    }

    const body = { amount };
    try {
        const response = await makeRequest(`listings/${listingId}/bids`, '', '', 'POST', body, {}, true);
        if (response) {
            console.log(`Bid of $${amount} placed successfully for listing ID: ${listingId}`);
            return response;
        }
    } catch (error) {
        console.error(`Failed to place bid on listing ID: ${listingId}`, error);
    }
    return null;
}