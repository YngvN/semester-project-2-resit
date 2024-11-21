

import { makeRequest, displayErrorModal } from "../../api/url.mjs";
import { calculateTimeLeft } from "../tileBuilder/timer.mjs";
import { viewBidHistory, openBidPopup } from "./bidsModal.mjs";

let countdownInterval;

/**
 * Opens a modal to display listing details.
 * Replaces "Place a Bid" with "You have the highest bid" if the user has the highest bid.
 * @param {string} listingId - The ID of the listing to display.
 */
export async function openListingModal(listingId) {
    // Fetch the listing data using makeRequest
    const listingData = await makeRequest(`listings/${listingId}`, '', '', 'GET', null, { _seller: true, _bids: true }, false);

    if (!listingData || !listingData.data) {
        displayErrorModal('Listing data could not be retrieved.');
        return;
    }

    const listingObject = listingData.data;

    const modalTitle = document.getElementById('listingModalLabel');
    const modalBody = document.getElementById('modalBody');

    if (!modalTitle || !modalBody) {
        displayErrorModal('Modal elements not found in the DOM.');
        return;
    }

    modalTitle.textContent = listingObject.title;

    // Get the current user's name from login data
    const loginData = JSON.parse(localStorage.getItem('loginData') || sessionStorage.getItem('loginData') || '{}');
    const currentUserName = loginData?.userData?.name;

    // Determine the highest bid and the highest bidder
    const highestBid = listingObject.bids?.length
        ? Math.max(...listingObject.bids.map(bid => bid.amount))
        : null;
    const highestBidder = listingObject.bids?.find(bid => bid.amount === highestBid)?.bidder.name;

    // Set up carousel or single image
    const imagesHTML = listingObject.media?.length > 1
        ? `
            <div id="imageCarousel" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    ${listingObject.media.map((image, index) => `
                        <div class="carousel-item ${index === 0 ? 'active' : ''}">
                            <img src="${image.url}" class="d-block w-100 img-fluid" alt="${image.alt || 'Image of ' + listingObject.title}"
                                 style="height: 300px; object-fit: cover;">
                        </div>
                    `).join('')}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#imageCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#imageCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        `
        : `
            <img src="${listingObject.media?.[0]?.url || 'default-listing-image.jpg'}" 
                 alt="${listingObject.media?.[0]?.alt || 'Default image'}" 
                 class="img-fluid mb-3" style="width: 100%; height: 300px; object-fit: cover;">
        `;

    modalBody.innerHTML = `
        ${imagesHTML}
        <p><strong>Seller:</strong> ${listingObject.seller?.name || 'Unknown'}</p>
        <p><strong>Bid Count:</strong> ${listingObject._count?.bids || 0} bids</p>
        <p><strong>Time Left:</strong> <span id="timeLeft">${calculateTimeLeft(listingObject.endsAt)}</span></p>
        <p><strong>Current Price:</strong> ${highestBid !== null ? `$${highestBid}` : 'No bids'}</p>
        <p><strong>Description:</strong> ${listingObject.description || 'No description available'}</p>
        <div class="button-container">
        ${highestBidder === currentUserName
            ? '<button class="btn btn-secondary mt-3">Highest bid</button>'
            : '<button id="bidButton" class="btn btn-primary mt-3">Place a Bid</button>'
        }
        <button id="viewBidsButton" class="btn btn-secondary mt-3 ms-2">View Bids</button>
        </div>
    `;

    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        const timeLeftElement = document.getElementById('timeLeft');
        if (timeLeftElement) {
            timeLeftElement.textContent = calculateTimeLeft(listingObject.endsAt);
        }
    }, 1000);

    try {
        const listingModal = new bootstrap.Modal(document.getElementById('listingModal'));
        listingModal.show();

        document.getElementById('listingModal').addEventListener('hidden.bs.modal', () => {
            clearInterval(countdownInterval);
        });
    } catch (error) {
        console.error('Bootstrap modal error:', error);
    }

    const bidButton = document.getElementById('bidButton');
    if (bidButton) {
        bidButton.removeEventListener('click', openBidPopup);
        bidButton.addEventListener('click', () => openBidPopup(listingId));
    }

    const viewBidsButton = document.getElementById('viewBidsButton');
    viewBidsButton.removeEventListener('click', () => viewBidHistory(listingObject.bids));
    viewBidsButton.addEventListener('click', () => viewBidHistory(listingObject.bids));
}