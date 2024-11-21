// import { openListingModal } from "../modal.mjs";

// // Store listings by ID
// const listingMap = new Map();

// /**
//  * Builds an individual auction tile based on a listing object.
//  * @param {Object} listingObject - The listing object from the API response.
//  * @returns {string} The HTML structure of the tile.
//  */
// export async function buildTile(listingObject) {
//     // Add the listingObject to the Map for easy access by ID
//     listingMap.set(listingObject.id, listingObject);

//     // Ensure bids count and sorting (if applicable)
//     const bidCount = listingObject._count?.bids || 0;
//     const bids = listingObject.bids || [];
//     bids.sort((a, b) => a.amount - b.amount);

//     // Determine the latest bid amount
//     const latestBidAmount = bids.length ? bids[bids.length - 1].amount : 'No bids';
//     const formattedBidAmount = typeof latestBidAmount === 'number'
//         ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(latestBidAmount)
//         : latestBidAmount;

//     // Calculate time left
//     const now = new Date();
//     const endsAt = new Date(listingObject.endsAt);
//     const timeLeft = Math.max(0, endsAt - now);
//     const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
//     const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
//     const timeLeftString = daysLeft > 0
//         ? `${daysLeft} days, ${hoursLeft} hours left`
//         : hoursLeft > 0
//             ? `${hoursLeft} hours, ${minutesLeft} minutes left`
//             : `${minutesLeft} minutes left`;

//     // Set fallback image if media is missing
//     const listingImage = listingObject.media?.length
//         ? listingObject.media[0].url
//         : '/src/assets/images/logo - notext.png';

//     // Create the HTML structure for the listing tile
//     const tileWrapper = document.createElement('div');
//     tileWrapper.className = 'col mb-4';
//     tileWrapper.innerHTML = `
//         <div class="card h-100 shadow-sm">
//             <button class="listing-tile-preview btn p-0 text-start" aria-label="Auction for ${listingObject.title}"
//                 onclick="window.openListingModalById('${listingObject.id}')">
//                 <div class="position-relative">
//                     <div class="image-container" style="height: 200px; overflow: hidden;">
//                         <img src="${listingImage}" alt="Image of ${listingObject.title}" class="card-img-top img-fluid" style="object-fit: cover; height: 100%; width: 100%; loading="lazy"">
//                     </div>
//                 </div>
//                 <div class="card-body">
//                     <h5 class="card-title text-center text-truncate" title="${listingObject.title}">${listingObject.title}</h5>
//                     <p class="card-text text-center">
//                         <span class="text-muted">${bidCount} bids</span> ·
//                         <span class="text-muted">${timeLeftString}</span>
//                     </p>
//                     <p class="text-center fw-bold">${formattedBidAmount}</p>
//                 </div>
//             </button>
//         </div>
//     `;

//     return tileWrapper.outerHTML;
// }

// /**
//  * Fetch listing by ID and open modal using only the ID string.
//  * @param {string} id - The ID of the listing to open in the modal.
//  */
// window.openListingModalById = async function (id) {
//     const listingObject = listingMap.get(id);
//     if (listingObject) {
//         openListingModal(listingObject.id);
//     } else {
//         console.error(`Listing with ID ${id} not found`);
//     }
// };

import { openListingModal } from "../modal/modal.mjs";
import { generateBidsTile } from "./userTiles/bidsTile.mjs";
import { generateListingsTile } from "./userTiles/listingTile.mjs";
import { generateWinsTile } from "./userTiles/winTiles.mjs";
import { calculateTimeLeft } from "./timer.mjs";

// Store listings by ID
const listingMap = new Map();

/**
 * Builds an individual auction tile based on a listing object.
 * Dynamically chooses the tile generator based on the category, or falls back to a default structure.
 * @param {Object} listingObject - The listing object from the API response.
 * @param {string} [category='listings'] - The category of the tile ('listings', 'bids', 'wins').
 * @returns {string} The HTML structure of the tile.
 */
export async function buildTile(listingObject, category = 'listings') {
    // Add the listingObject to the Map for easy access by ID
    listingMap.set(listingObject.id, listingObject);

    // Choose the appropriate tile generator or fallback to default
    let dynamicContent;
    switch (category) {
        case 'bids':
            dynamicContent = generateBidsTile(listingObject);
            break;
        case 'wins':
            dynamicContent = generateWinsTile(listingObject);
            break;
        case 'listings':
            dynamicContent = generateListingsTile(listingObject);
            break;
        default:
            // Use the default HTML structure if no category or invalid category is provided
            const listingImage = listingObject.media?.length
                ? listingObject.media[0].url
                : '/src/assets/images/logo - notext.png';
            const bidCount = listingObject._count?.bids || 0;
            const timeLeftString = calculateTimeLeft(listingObject.endsAt);
            const latestBidAmount = listingObject.bids?.length
                ? listingObject.bids[listingObject.bids.length - 1].amount
                : 'No bids';
            const formattedBidAmount = typeof latestBidAmount === 'number'
                ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(latestBidAmount)
                : latestBidAmount;

            dynamicContent = `
                <div class="position-relative">
                    <div class="image-container" style="height: 200px; overflow: hidden;">
                        <img src="${listingImage}" alt="Image of ${listingObject.title}" class="card-img-top img-fluid" 
                             style="object-fit: cover; height: 100%; width: 100%;" loading="lazy">
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title text-center text-truncate" title="${listingObject.title}">${listingObject.title}</h5>
                    <p class="card-text text-center">
                        <span class="text-muted">${timeLeftString}</span>
                    </p>
                    <p class="text-center fw-bold">${formattedBidAmount}</p>
                </div>
            `;
            break;
    }

    // Create the HTML structure for the listing tile
    const tileWrapper = document.createElement('div');
    tileWrapper.className = 'col mb-4';
    tileWrapper.innerHTML = `
        <div class="card h-100">
            <button class="listing-tile-preview btn p-0 text-start" aria-label="Auction for ${listingObject.title}"
                onclick="window.openListingModalById('${listingObject.id}')">
                ${dynamicContent}
            </button>
        </div>
    `;

    return tileWrapper.outerHTML;
}

/**
 * Fetch listing by ID and open modal using only the ID string.
 * @param {string} id - The ID of the listing to open in the modal.
 */
window.openListingModalById = async function (id) {
    const listingObject = listingMap.get(id);
    if (listingObject) {
        openListingModal(listingObject.id);
    } else {
        console.error(`Listing with ID ${id} not found`);
    }
};