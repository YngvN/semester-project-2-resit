import { makeRequest } from '../../js/api/url.mjs';
import { buildTile } from '../../js/components/auctionTile.mjs';

document.addEventListener("DOMContentLoaded", () => {
    console.log('Home.mjs loaded');

    async function buildListingTiles() {
        try {
            // Fetch listings with seller and bids data
            const listings = await makeRequest('listings', '', '', 'GET', null, '_seller=true&_bids=true');

            if (!listings || listings.length === 0) {
                console.log('No listings found.');
                return;
            }

            // Build tiles for each listing
            const tilePromises = listings.map(listing => buildTile(listing));
            const tiles = await Promise.all(tilePromises);

            const tilesRow = document.getElementById('tiles-row');
            if (!tilesRow) {
                console.error('Tiles row container not found in the DOM');
                return;
            }

            tilesRow.innerHTML = ''; // Clear existing content if any

            // Append each tile's HTML to the row container
            tiles.forEach(tileHTML => {
                const wrapper = document.createElement('div');
                wrapper.className = 'col-md-4 mb-4';
                wrapper.innerHTML = tileHTML.trim();
                tilesRow.appendChild(wrapper);
            });
        } catch (error) {
            console.error('Error fetching or building listing tiles:', error);
        }
    }

    // Call the function after DOM is ready
    buildListingTiles().then(() => {
        console.log('buildListingTiles function completed');
    });
});
