import { calculateTimeLeft } from "../timer.mjs";

/**
 * Generates the HTML content for a bid tile.
 * @param {Object} listingObject - The listing object from the API response.
 * @returns {string} The HTML structure for the bid tile.
 */
export function generateWinsTile(listingObject) {
    const listingImage = listingObject.media?.length
        ? listingObject.media[0].url
        : '/src/assets/images/logo - notext.png';

    // Assume bid count is always 1 since this is for individual bids
    const bidCount = 1;

    // Retrieve the bid amount from the listingObject
    const latestBidAmount = listingObject.bidAmount || 'No bids';

    // Format the bid amount
    const formattedBidAmount = typeof latestBidAmount === 'number'
        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(latestBidAmount)
        : latestBidAmount;

    // Calculate the time left for the auction
    const timeLeftString = calculateTimeLeft(listingObject.endsAt);

    // Generate the image container HTML
    const imageContainer = `
        <div class="position-relative">
            <div class="image-container" style="height: 200px; overflow: hidden;">
                <img src="${listingImage}" alt="Image of ${listingObject.title}" 
                     class="card-img-top img-fluid" style="object-fit: cover; height: 100%; width: 100%;" loading="lazy">
            </div>
        </div>
    `;

    // Generate the card body HTML
    const cardBody = `
        <div class="card-body">
            <h5 class="card-title text-center text-truncate" title="${listingObject.title}">${listingObject.title}</h5>
            <p class="card-text text-center">
                <span class="text-muted">${timeLeftString}</span>
            </p>
            <p class="text-center fw-bold">${formattedBidAmount}</p>
        </div>
    `;

    return `${imageContainer}${cardBody}`;
}
