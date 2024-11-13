
import { makeRequest } from '../api/url.mjs';
import { buildTile } from './auctionTile.mjs';
import { revealElement, hideElement } from '../animation/fade.mjs';

/**
 * Builds listing tiles based on type: 'bids', 'wins', 'published', or defaults to all active listings.
 * @param {string} type - The type of listings to retrieve ('bids', 'wins', 'published').
 * @param {string} profileName - The profile name for filtering bids or wins.
 * @param {string} elementId - The ID of the container to populate with the tiles.
 */
export async function buildListingTiles(type = '', profileName = '', elementId = 'tiles-row') {
    let category = 'listings';
    const params = { _seller: true, _bids: true };
    let authRequired = false;

    // Add filter to get only active listings if type is default
    if (!type) {
        params._active = true;  // Retrieve only active listings
    }

    if (type === 'bids') {
        category = `profiles/${profileName}/bids`;
        params._listings = true;
        authRequired = true;
    } else if (type === 'wins') {
        category = `profiles/${profileName}/wins`;
        authRequired = true;
    } else if (type === 'published' && profileName) {
        category = `profiles/${profileName}/listings`;
        authRequired = true;
    }

    const tilesRow = document.getElementById(elementId);
    if (!tilesRow) {
        console.error(`Container with ID ${elementId} not found in the DOM`);
        return;
    }

    hideElement(tilesRow);

    try {
        // Fetch listings based on the type or default to active listings
        const response = await makeRequest(category, '', '', 'GET', null, params, authRequired);

        if (!response || !response.data || response.data.length === 0) {
            tilesRow.innerHTML = `
                <div class="d-flex justify-content-center align-items-center" style="height: 300px;">
                    <p class="text-center mt-4">No ${type || 'listings'} found.</p>
                </div>`;
            revealElement(tilesRow);
            return;
        }

        // Determine the listings data format based on type
        let listings = response.data;

        // For bids, extract listing data if present in each bid
        if (type === 'bids') {
            listings = listings.map(bid => bid.listing).filter(listing => listing); // Use only listings present
        }

        // Build tiles for each listing
        const tilePromises = listings.map(listing => buildTile(listing));
        const tiles = await Promise.all(tilePromises);

        tilesRow.innerHTML = ''; // Clear existing content if any

        // Append each tile's HTML to the row container
        tiles.forEach(tileHTML => {
            const wrapper = document.createElement('div');
            wrapper.className = 'col-md-4 mb-4';
            wrapper.innerHTML = tileHTML.trim();
            tilesRow.appendChild(wrapper);
        });

        // Reveal tilesRow after building is complete
        revealElement(tilesRow);
    } catch (error) {
        console.error(`Error fetching or building ${type || 'all'} listing tiles:`, error);
    }
}
