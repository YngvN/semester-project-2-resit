import { buildModal } from "../components/modal/modalBuilder.mjs";

const URL = "https://v2.api.noroff.dev/";
const baseURL = "https://v2.api.noroff.dev/auction/";

export const registerURL = `${URL}auth/register`;
export const loginURL = `${URL}auth/login`;

const apiKey = "9448450f-e334-42ab-b07d-76bf3129b9ba";
let cachedToken = null;

/**
 * Generates headers, conditionally including Authorization header
 * @param {boolean} authRequired - Whether to include the Authorization header
 */
function getDefaultHeaders(authRequired = true) {
    const headers = {
        'Content-Type': 'application/json',
        "X-Noroff-API-Key": apiKey
    };
    if (authRequired) {
        headers.Authorization = `Bearer ${getAccessToken()}`;
    }
    return headers;
}

// Function to get the token from storage or fallback to the hardcoded token
function getAccessToken() {
    let loginData = JSON.parse(localStorage.getItem("loginData")) || JSON.parse(sessionStorage.getItem("loginData"));
    return loginData && loginData.data && loginData.data.accessToken
        ? loginData.data.accessToken
        : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODcyLCJuYW1lIjoiVGVzdCIsImVtYWlsIjoidGVzdDEyM0BzdHVkLm5vcm9mZi5ubyIsImF2YXRhciI6bnVsbCwiY3JlZGl0cyI6MTAwMCwid2lucyI6W10sImlhdCI6MTcwMjA1MzYyOX0.7kCQWtGXsmwJw5gnSqCX4Kg-QROxkG6K9EBzh4_ItRk";
}

/**
 * Utility function to create request options based on method, body, and auth requirement
 * @param {string} method - HTTP method
 * @param {object|null} body - Request body
 * @param {boolean} authRequired - Whether the Authorization header is needed
 */
function createRequestOptions(method, body = null, authRequired = true) {
    const options = {
        method,
        headers: getDefaultHeaders(authRequired),
    };
    if (body) options.body = JSON.stringify(body);
    return options;
}

/**
 * Makes a request with optional ID, subcategory, parameters, and auth flag
 * @param {string} category - URL category
 * @param {string} id - Optional ID for the resource
 * @param {string} subcategory - Optional subcategory
 * @param {string} method - HTTP method
 * @param {object|null} body - Request body
 * @param {object} params - Query parameters
 * @param {boolean} authRequired - Whether the Authorization header is needed
 */
export async function makeRequest(category, id = '', subcategory = '', method = 'GET', body = null, params = {}, authRequired = true) {
    let url = `${baseURL}${category}`;
    if (!category.includes("search")) {
        if (id) url += `/${id}`;
        if (subcategory) url += `/${subcategory}`;
    }

    const queryParams = new URLSearchParams(params).toString();
    if (queryParams) url += `?${queryParams}`;

    try {
        console.log(url);
        const options = createRequestOptions(method, body, authRequired);
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json();
            handleAPIError(errorData);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error with ${method} request to ${url}:`, error);
    }
}

/**
 * Parses API error response and displays it using modalBuilder.
 */
function handleAPIError(errorData) {
    let errorMessage = `Status: ${errorData.status}\nStatus Code: ${errorData.statusCode}\n`;

    if (errorData.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach(error => {
            errorMessage += `\nError Message: ${error.message}`;
            if (error.code) errorMessage += `\nError Code: ${error.code}`;
            if (error.path) errorMessage += `\nError Path: ${error.path.join(" > ")}`;
        });
    } else {
        errorMessage += "Unknown error format.";
    }

    console.error(errorMessage);

    // Use modalBuilder to display the error message
    buildModal(null, errorMessage, "error", { dismissible: true });
}

/**
 * Searches listings by title, description, or tags
 */
export async function searchListings(searchTerm, additionalParams = {}) {
    const params = { q: searchTerm, ...additionalParams };
    return await makeRequest("listings/search", '', '', 'GET', null, params);
}
