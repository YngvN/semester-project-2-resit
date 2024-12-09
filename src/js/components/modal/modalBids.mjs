import { hideElement, revealElement } from "../../animation/fade.mjs";

/**
 * Populates the bids view with user names and their bids.
 * @param {HTMLElement} bodyBids - The container element for the bids view.
 * @param {Array} bidData - An array of bid objects containing `bidder` and `amount`.
 * @param {HTMLElement} bodyListing - The listing view container for navigation purposes.
 */
export async function populateBids(bodyBids, bidData = [], bodyListing) {
    // Validate required elements
    if (!bodyBids || !bodyListing) {
        console.error('Invalid bodyBids or bodyListing element.');
        return;
    }

    // Clear previous content
    bodyBids.innerHTML = '';

    // Get the current user's name from localStorage or sessionStorage
    const loginData = JSON.parse(localStorage.getItem('loginData') || sessionStorage.getItem('loginData') || '{}');
    const currentUserName = loginData?.userData?.name;

    // Create a container for bid information
    const bidsContainer = document.createElement('div');
    bidsContainer.className = 'listings-container';
    bidsContainer.setAttribute('role', 'table');

    // Add table headers
    const headerRow = document.createElement('div');
    headerRow.className = 'listings-row listings-header';
    headerRow.setAttribute('role', 'row');

    const usernameHeader = document.createElement('div');
    usernameHeader.className = 'listings-column listings-username-header';
    usernameHeader.setAttribute('role', 'columnheader');
    usernameHeader.textContent = 'Username';

    const amountHeader = document.createElement('div');
    amountHeader.className = 'listings-column listings-amount-header';
    amountHeader.setAttribute('role', 'columnheader');
    amountHeader.textContent = 'Amount';

    headerRow.appendChild(usernameHeader);
    headerRow.appendChild(amountHeader);
    bidsContainer.appendChild(headerRow);

    // Populate bids
    bidData.forEach(({ bidder: { name: username } = {}, amount }) => {
        const bidRow = document.createElement('div');
        bidRow.className = 'listings-row';
        bidRow.setAttribute('role', 'row');

        const usernameCell = document.createElement('div');
        usernameCell.className = 'listings-column listings-username';
        usernameCell.setAttribute('role', 'cell');
        usernameCell.textContent = username || 'Anonymous';

        const amountCell = document.createElement('div');
        amountCell.className = 'listings-column listings-amount';
        amountCell.setAttribute('role', 'cell');
        amountCell.textContent = `$${amount}`;

        // Highlight the current user's row
        if (username === currentUserName) {
            bidRow.classList.add('highlight-active');
        }

        bidRow.appendChild(usernameCell);
        bidRow.appendChild(amountCell);
        bidsContainer.appendChild(bidRow);
    });

    // Append the bids container to the body
    bodyBids.appendChild(bidsContainer);

    const hideBody = document.getElementById('body-bids');

    // Add the Back button at the bottom
    const backButtonContainer = document.createElement('div');
    backButtonContainer.className = 'modal-footer';
    const backButton = document.createElement('button');
    backButton.className = 'btn-back btn btn-secondary';
    backButton.textContent = 'Back';

    backButtonContainer.appendChild(backButton);
    bodyBids.appendChild(backButtonContainer);

    // Add back button functionality
    backButton.addEventListener('click', () => {
        hideElement(hideBody); // Hide bids view
        revealElement(bodyListing); // Show listing view
    });
}
