import { revealElement, hideElement } from "../../animation/fade.mjs";
import { createModalHeader } from "./modalBuilder.mjs";
import { populateBids } from "./modalBids.mjs";
import { placeBid } from "./modalPlaceBid.mjs";
import { calculateTimeLeft } from "../tileBuilder/timer.mjs";

/**
 * Builds and initializes a modal listing view using the listing data.
 * @param {string} modalInstance - The unique modal instance identifier.
 * @param {Object} listingData - The data object for the listing.
 */
export function buildModalListing(modalInstance, listingData) {
    const { title = 'Default Title', description = 'Default description.', bids = [], seller = {}, media = [], endsAt } = listingData.data;

    const modalContent = document.querySelector(`.modal-content[data-modal-instance="${modalInstance}"]`);
    if (!modalContent) {
        console.error(`Modal with instance ${modalInstance} not found.`);
        return;
    }


    // Create modal header
    const modalHeader = createModalHeader(title, async () => {
        try {
            await hideElement(modalContent);
        } catch (error) {
            console.error("Failed to hide the modal:", error);
        }
    });

    // Create background container
    const backgroundContainer = document.createElement('div');
    backgroundContainer.className = 'modal-background';
    if (media.length > 0) {
        const activeImage = media[0]?.url || 'default-listing-image.jpg';
        backgroundContainer.style.backgroundImage = `url(${activeImage})`;
        backgroundContainer.style.backgroundSize = 'cover';
        backgroundContainer.style.backgroundRepeat = 'no-repeat';
        backgroundContainer.style.backgroundPosition = 'center';
    }

    // Add background container before modal content
    modalContent.appendChild(backgroundContainer);

    // Create views
    const bodyListingWrapper = document.createElement('div');
    bodyListingWrapper.id = 'body-listing';
    const bodyListing = document.createElement('div');
    bodyListing.className = 'modal-body';
    bodyListingWrapper.appendChild(bodyListing);

    const bodyBidsWrapper = document.createElement('div');
    bodyBidsWrapper.id = 'body-bids';
    bodyBidsWrapper.style.display = 'none'; // Initially hidden
    const bodyBids = document.createElement('div');
    bodyBids.className = 'modal-body';
    bodyBidsWrapper.appendChild(bodyBids);

    const bodyPlaceBidWrapper = document.createElement('div');
    bodyPlaceBidWrapper.id = 'body-placeBid';
    bodyPlaceBidWrapper.style.display = 'none'; // Initially hidden

    // Generate carousel or single image
    const imagesHTML = media.length > 1
        ? `
            <div id="imageCarousel" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    ${media.map((image, index) => `
                        <div class="carousel-item ${index === 0 ? 'active' : ''}">
                            <img src="${image.url}" class="d-block w-100 img-fluid" alt="${image.alt || `Image of ${title}`}"
                                 style="height: 300px; object-fit: contain;">
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
            <img src="${media[0]?.url || 'default-listing-image.jpg'}" 
                 alt="${media[0]?.alt || 'Default image'}" 
                 class="img-fluid mb-3" style="width: 100%; height: 300px; object-fit: contain;">
        `;



    // Determine highest bid and bidder
    const highestBid = bids.length ? Math.max(...bids.map(bid => bid.amount)) : null;
    const highestBidder = bids.find(bid => bid.amount === highestBid)?.bidder.name;

    const loginData = JSON.parse(localStorage.getItem('loginData') || sessionStorage.getItem('loginData') || '{}');
    const currentUserName = loginData?.userData?.name;

    // Populate the listing view
    bodyListing.innerHTML = `
    ${imagesHTML}
    <p><strong>Seller:</strong> ${seller.name || 'Unknown'}</p>
    <p><strong>Bid Count:</strong> ${bids.length} bids</p>
    <p><strong>Time Left:</strong> <span id="timeLeft">${calculateTimeLeft(endsAt)}</span></p>
    <p><strong>Current Highest Bid:</strong> ${highestBid !== null ? `$${highestBid}` : 'No bids'}</p>
    <p><strong>Description:</strong> ${description}</p>
`;

    // Create modal-footer dynamically
    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';

    // Check conditions and populate modal-footer
    if (seller.name === currentUserName) {
        modalFooter.innerHTML = `
        <button class="btn btn-unavailable mt-3" disabled>You are the seller of this listing.</button>
        ${bids.length > 0 ? '<button id="viewBidsButton" class="btn btn-secondary mt-3 ms-2">View Bids</button>' : ''}
    `;
    } else if (highestBidder === currentUserName) {
        modalFooter.innerHTML = `
        <button class="btn btn-unavailable mt-3" disabled>You have the highest bid</button>
        ${bids.length > 0 ? '<button id="viewBidsButton" class="btn btn-secondary mt-3 ms-2">View Bids</button>' : ''}
    `;
    } else {
        // Otherwise, show the Place Bid and View Bids buttons
        modalFooter.innerHTML = `
        <button id="bidButton" class="btn btn-primary mt-3">Place a Bid</button>
        ${bids.length > 0 ? '<button id="viewBidsButton" class="btn btn-secondary mt-3 ms-2">View Bids</button>' : ''}
    `;
    }
    // Append views to modal content
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(bodyListingWrapper);
    modalContent.appendChild(bodyBidsWrapper);
    modalContent.appendChild(bodyPlaceBidWrapper);
    bodyListing.appendChild(modalFooter);

    // Add event listener for carousel image changes
    if (media.length > 1) {
        const carousel = modalContent.querySelector('#imageCarousel');
        carousel.addEventListener('slid.bs.carousel', () => {
            const activeItem = carousel.querySelector('.carousel-item.active img');
            if (activeItem) {
                backgroundContainer.style.backgroundImage = `url(${activeItem.src})`;
            }
        });
    }

    // Populate the Bids View
    populateBids(bodyBids, bids, bodyListingWrapper);

    // Add navigation to Place Bid view using placeBid function
    const bidButton = modalContent.querySelector('#bidButton');
    if (bidButton) {
        bidButton.addEventListener('click', () => {
            hideElement(bodyListingWrapper);
            placeBid(modalContent, modalInstance, loginData.userData?.credits, highestBid, title);
        });
    }

    // Handle navigation back from bids
    const viewBidsButton = modalContent.querySelector('#viewBidsButton');
    if (viewBidsButton) {
        viewBidsButton.addEventListener('click', () => {
            hideElement(bodyListingWrapper);
            revealElement(bodyBidsWrapper);
        });
    }

    // Update time left every second
    setInterval(() => {
        const timeLeftElement = modalContent.querySelector('#timeLeft');
        if (timeLeftElement) {
            timeLeftElement.textContent = calculateTimeLeft(endsAt);
        }
    }, 1000);
}
