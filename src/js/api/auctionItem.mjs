import { createURL } from "./url.mjs";

/**
 * Fetches auction listings from the /auction/listings endpoint.
 * @param {string} filters - (Optional) Additional filters to apply to the request.
 * @returns {Promise<object>} - The data fetched from the listings endpoint.
 */
export async function getListings(filters = '') {
    const category = "listings";

    try {
        const listings = await createURL(category, '', '', 'GET', null, filters);
        return listings;
    } catch (error) {
        console.error('Error fetching auction listings:', error);
    }
}