import { openListingModal } from "./modal.mjs";

// Store listings by ID
const listingMap = new Map();

export async function buildTile(listingObject) {
    // Add the listingObject to the Map for easy access by ID
    listingMap.set(listingObject.id, listingObject);

    // Sort bids in ascending order by amount if available
    if (listingObject.bids && listingObject.bids.length > 0) {
        listingObject.bids.sort((a, b) => a.amount - b.amount);
    }

    // Calculate time left
    const now = new Date();
    const endsAt = new Date(listingObject.endsAt);
    const timeLeft = Math.max(0, endsAt - now);
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    const timeLeftString = daysLeft > 0
        ? `${daysLeft} days, ${hoursLeft} hours left`
        : `${hoursLeft} hours left`;

    // Determine the latest bid amount
    const latestBidAmount = listingObject.bids?.length
        ? listingObject.bids[listingObject.bids.length - 1].amount
        : 'No bids';

    const formattedBidAmount = typeof latestBidAmount === 'number'
        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(latestBidAmount)
        : latestBidAmount;

    // Set fallback image if media is missing
    const listingImage = listingObject.media?.length
        ? listingObject.media[0].url
        : '/src/assets/images/logo - notext.png';


    // Create the HTML structure for the listing tile with a container for the image
    const tileWrapper = document.createElement('div');
    tileWrapper.className = 'col mb-4';
    tileWrapper.innerHTML = `
        <div class="card h-100 shadow-sm">
            <button class="listing-tile-preview btn p-0 text-start" aria-label="Auction for ${listingObject.title}"
                onclick="window.openListingModalById('${listingObject.id}')">
                <div class="position-relative">
                    <div class="image-container" style="height: 200px; overflow: hidden;">
                        <img src="${listingImage}" alt="Image of ${listingObject.title}" class="card-img-top img-fluid" style="object-fit: cover; height: 100%; width: 100%;">
                    </div>
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

    return tileWrapper.outerHTML;
}

// Fetch listing by ID and open modal using only the ID string
window.openListingModalById = async function (id) {
    const listingObject = listingMap.get(id);
    if (listingObject) {
        openListingModal(listingObject.id);
    } else {
        console.error(`Listing with ID ${id} not found`);
    }
};
