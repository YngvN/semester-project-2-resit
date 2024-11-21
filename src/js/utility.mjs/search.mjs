import { makeRequest } from "../api/url.mjs";
import { buildTile } from "../components/tileBuilder/tileBuilder.mjs";
import { hideElement, revealElement } from "../animation/fade.mjs";

let searchTimer; // Timer to debounce the search

/**
 * Fetches search results for a given query
 * @param {string} query - The search query
 * @returns {Promise<Array>} - Array of search results
 */
async function searchItems(query) {
    const params = { q: query };

    try {
        const data = await makeRequest("listings/search", '', '', 'GET', null, params);
        console.log("Search results:", data);
        return data.data || []; // Safely access data array
    } catch (error) {
        console.error("Error searching for items:", error);
        return [];
    }
}

// Add event listener to the search input to handle input events
document.getElementById("searchInput").addEventListener("input", (event) => {
    const query = event.target.value.trim();
    const searchResultsContainer = document.getElementById("searchResultsContainer");
    const tilesContainer = document.getElementById("tiles-container");
    const clearSearch = document.getElementById("clearSearch");

    // Show or hide the clear (×) button based on input value
    clearSearch.style.display = query.length > 0 ? 'inline' : 'none';

    // Clear the previous timer if it exists
    clearTimeout(searchTimer);

    // Set a new timer to wait for 1 second of inactivity before searching
    searchTimer = setTimeout(async () => {
        if (query.length > 2) {
            const results = await searchItems(query);

            // Hide the static tiles container
            hideElement(tilesContainer);

            // Display results in the search results container
            displaySearchResults(results, query);
        } else {
            // Hide the search results container if the query is too short
            hideElement(searchResultsContainer);

            // Reveal the static tiles container
            revealElement(tilesContainer);
        }
    }, 1000); // 1 second delay
});

// Event listener for the clear (×) button
document.getElementById("clearSearch").addEventListener("click", () => {
    const searchInput = document.getElementById("searchInput");
    const searchResultsContainer = document.getElementById("searchResultsContainer");
    const tilesContainer = document.getElementById("tiles-container");

    searchInput.value = ""; // Clear the input field
    hideElement(searchResultsContainer); // Hide search results
    revealElement(tilesContainer); // Show the static tiles
    document.getElementById("clearSearch").style.display = 'none'; // Hide the clear button
});

/**
 * Function to display search results in the UI
 * @param {Array} results - Array of search results
 * @param {string} query - The search query
 */
async function displaySearchResults(results, query) {
    const resultsContainer = document.getElementById("searchResultsRow");
    const searchResultsContainer = document.getElementById("searchResultsContainer");
    const searchResultsSummary = document.getElementById("searchResultsSummary");

    resultsContainer.innerHTML = ""; // Clear previous results

    if (results && results.length > 0) {
        // Set summary with the number of results and query
        searchResultsSummary.textContent = `${results.length} matches found for "${query}"`;

        // Generate tiles HTML
        const tilesHTML = await Promise.all(results.map(async (item) => {
            const resultTileHTML = await buildTile(item);
            return `<div class="col-md-4">${resultTileHTML}</div>`;
        }));

        resultsContainer.innerHTML = tilesHTML.join(""); // Set all tiles in a single operation
        revealElement(searchResultsContainer);
    } else {
        // Set summary for no matches
        searchResultsSummary.textContent = `No matches found for "${query}"`;
        resultsContainer.innerHTML = "<p>Try adjusting your search.</p>";
        revealElement(searchResultsContainer);
    }
}

console.log('search.mjs loaded');
