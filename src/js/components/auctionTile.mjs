import { openListingModal } from "./modal.mjs";

// Create a Map to store listings by ID
const listingMap = new Map();

export async function buildTile(listingObject) {
    // Add listingObject to the Map using its id
    listingMap.set(listingObject.id, listingObject);

    // Sort bids by amount if they exist
    if (listingObject.bids && listingObject.bids.length > 0) {
        listingObject.bids.sort((a, b) => a.amount - b.amount);
    }

    // Calculate time left
    const now = new Date();
    const endsAt = new Date(listingObject.endsAt);
    const timeDiff = endsAt - now;
    const hoursLeft = timeDiff / (1000 * 60 * 60);
    const daysLeft = hoursLeft / 24;

    let timeLeftString;
    if (daysLeft >= 1) {
        const remainingHours = Math.floor(hoursLeft % 24);
        timeLeftString = `${Math.floor(daysLeft)} days, ${remainingHours} hours left`;
    } else {
        timeLeftString = `${Math.floor(hoursLeft)} hours left`;
    }

    // Get latest bid amount or display 'No bids'
    let latestBidAmount = listingObject.bids && listingObject.bids.length > 0
        ? listingObject.bids[listingObject.bids.length - 1].amount
        : 'No bids';

    // Format latest bid amount as currency if it is a number
    const formattedBidAmount = typeof latestBidAmount === 'number'
        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(latestBidAmount)
        : latestBidAmount;

    // Set fallback images if media is missing
    const listingImage = listingObject.media && listingObject.media.length > 0
        ? listingObject.media[0].url
        : 'default-listing-image.jpg';

    // Construct HTML for the tile with inline onclick event
    const tileWrapper = document.createElement('div');
    tileWrapper.className = 'col mb-4';

    // Use inline `onclick` to call `openListingModal` with the listing's id
    tileWrapper.innerHTML = `
        <div class="card h-100 shadow-sm">
            <button class="listing-tile-preview btn p-0 text-start" aria-label="Auction for ${listingObject.title}"
                onclick="window.openListingModalById('${listingObject.id}')">
                <div class="position-relative">
                    <img src="${listingImage}" alt="Image of ${listingObject.title}" class="card-img-top img-fluid" style="object-fit: cover; height: 200px;">
                </div>
                <div class="card-body">
                    <h5 class="card-title text-center text-truncate" title="${listingObject.title}">${listingObject.title}</h5>
                    <p class="card-text text-center">
                        <span class="text-muted">${listingObject._count?.bids || 0} bids</span> ·
                        <span class="text-muted">${timeLeftString}</span>
                    </p>
                    <p class="text-center fw-bold">${formattedBidAmount}</p>
                </div>
            </button>
        </div>
    `;

    return tileWrapper.outerHTML; // Return the HTML as a string
}

// Expose a global function to fetch the listing by id and open the modal
window.openListingModalById = function (id) {
    const listingObject = listingMap.get(id);
    if (listingObject) {
        openListingModal(listingObject);
    } else {
        console.error(`Listing with ID ${id} not found`);
    }
};
