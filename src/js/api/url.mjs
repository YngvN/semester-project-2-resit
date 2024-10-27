const URL = "https://v2.api.noroff.dev/";
const baseURL = "https://v2.api.noroff.dev/auction/";


export const registerURL = URL + "auth/register";
export const loginURL = URL + "auth/login";

const apiKey = "9448450f-e334-42ab-b07d-76bf3129b9ba";

// Function to get the token from storage or fallback to the hardcoded token
function getAccessToken() {
    let loginData = JSON.parse(localStorage.getItem("loginData")) || JSON.parse(sessionStorage.getItem("loginData"));
    return loginData && loginData.data && loginData.data.accessToken
        ? loginData.data.accessToken
        : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODcyLCJuYW1lIjoiVGVzdCIsImVtYWlsIjoidGVzdDEyM0BzdHVkLm5vcm9mZi5ubyIsImF2YXRhciI6bnVsbCwiY3JlZGl0cyI6MTAwMCwid2lucyI6W10sImlhdCI6MTcwMjA1MzYyOX0.7kCQWtGXsmwJw5gnSqCX4Kg-QROxkG6K9EBzh4_ItRk";
}

// Set default headers, dynamically using the token from storage or fallback
const defaultHeaders = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + getAccessToken(),
    "X-Noroff-API-Key": apiKey
};

/**
 * Makes a request based on the specified HTTP method and URL components
 * @param {string} category - First part of the URL (e.g., "listings")
 * @param {string} id - (Optional) ID to find specific items 
 * @param {string} subcategory - (Optional) Third part to find specific items (e.g., "bids")
 * @param {string} method - HTTP method ("GET", "POST", "PUT", "DELETE")
 * @param {object} body - (Optional) Data to be sent with the request
 * @param {object} params - (Optional) An object of query parameters
 */
export async function makeRequest(category, id = '', subcategory = '', method = 'GET', body = null, params = {}) {
    let url = `${baseURL}${category}`;

    // Only add `id` and `subcategory` if not using a search endpoint
    if (!category.includes("search")) {
        if (id) url += `/${id}`;
        if (subcategory) url += `/${subcategory}`;
    }

    // Add query parameters for all requests as needed
    const queryParams = new URLSearchParams(params).toString();
    if (queryParams) url += `?${queryParams}`;

    console.log(`URL created for method ${method}: ${url}`);

    try {
        switch (method) {
            case "POST":
                return await postData(url, body);
            case "PUT":
                return await putData(url, body);
            case "DELETE":
                return await deleteData(url);
            default:
                return await fetchData(url);
        }
    } catch (error) {
        console.error(`Error with ${method} request to ${url}:`, error);
    }
}



/**
 * Fetches data from the specified URL
 * @param {string} url 
 * @returns {Promise<object>} - Response data from the fetch
 */
async function fetchData(url) {
    console.log("Fetching data from URL:", url);

    try {
        const response = await fetch(url, { headers: defaultHeaders });
        if (!response.ok) {
            const errorData = await response.json();
            handleAPIError(errorData);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        return data;
    } catch (error) {
        console.error('Problem fetching data:', error);
    }
}

/**
 * Searches listings by title, description, or tags
 * @param {string} searchTerm - The term to search for
 * @param {object} additionalParams - Additional query parameters (e.g., `_active: true`)
 * @returns {Promise<object>} - The search results
 */
export async function searchListings(searchTerm, additionalParams = {}) {
    // Add search term to the query parameters
    const params = { q: searchTerm, ...additionalParams };

    return await makeRequest("listings/search", '', '', 'GET', null, params);
}

/**
 * Sends a POST request
 * @param {string} url 
 * @param {object} body 
 * @returns {Promise<object>} - Response data from the POST request
 */
async function postData(url, body) {
    console.log("Sending POST request to URL:", url);

    const options = {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(body),
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json();
            handleAPIError(errorData);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Response data from POST:", data);
        return data;
    } catch (error) {
        console.error('Problem with POST request:', error);
    }
}

/**
 * Sends a PUT request
 * @param {string} url 
 * @param {object} body 
 * @returns {Promise<object>} - Response data from the PUT request
 */
async function putData(url, body) {
    console.log("Sending PUT request to URL:", url);
    console.log("Request body:", JSON.stringify(body, null, 2));

    const options = {
        method: 'PUT',
        headers: defaultHeaders,
        body: JSON.stringify(body),
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json();
            handleAPIError(errorData);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Response data from PUT:", data);
        return data;
    } catch (error) {
        console.error('Problem with PUT request:', error);
    }
}


/**
 * Sends a DELETE request
 * @param {string} url - The URL to send the DELETE request to
 * @returns {Promise<void>}
 */
async function deleteData(url) {
    console.log("Sending DELETE request to URL:", url);

    const options = {
        method: 'DELETE',
        headers: defaultHeaders,
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json();
            handleAPIError(errorData);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log("Item successfully deleted from URL:", url);
    } catch (error) {
        console.error('Problem with DELETE request:', error);
    }
}

/**
 * Logs detailed API error information based on the error structure and displays it in a modal.
 * @param {object} errorData - The error response from the API.
 */
function handleAPIError(errorData) {
    let errorMessage = `Status: ${errorData.status}\nStatus Code: ${errorData.statusCode}\n`;

    if (errorData.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((error) => {
            errorMessage += `\nError Message: ${error.message}`;

            if (error.code) {
                errorMessage += `\nError Code: ${error.code}`;
            }

            if (error.path) {
                errorMessage += `\nError Path: ${error.path.join(" > ")}`;
            }
        });
    } else {
        errorMessage += "Unknown error format.";
        console.error("Unknown error format:", errorData);
    }

    console.error(errorMessage); // Log detailed error to console
    displayErrorModal(errorMessage); // Show the error message in a modal
}

/**
 * Creates and displays an error modal with the given message.
 * @param {string} message - The error message to display in the modal.
 */
export function displayErrorModal(message) {
    // Check if the modal already exists in the DOM
    let errorModal = document.getElementById("errorModal");

    if (!errorModal) {
        // Create a new modal element if it doesn't exist
        errorModal = document.createElement("div");
        errorModal.id = "errorModal";
        errorModal.className = "modal fade";
        errorModal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Error</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="errorModalMessageContainer">
                        <!-- Error messages will be added here as individual <p> elements -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(errorModal);

        // Add event listeners to close the modal
        errorModal.querySelector(".btn-close").addEventListener("click", closeErrorModal);
        errorModal.querySelector(".btn-secondary").addEventListener("click", closeErrorModal);
    }

    // Populate the modal with each line as a separate <p> element
    const errorModalMessageContainer = document.getElementById("errorModalMessageContainer");
    errorModalMessageContainer.innerHTML = ""; // Clear previous messages

    // Split the message into lines and create a <p> for each line
    message.split("\n").forEach(line => {
        const paragraph = document.createElement("p");
        paragraph.textContent = line;
        errorModalMessageContainer.appendChild(paragraph);
    });

    // Show the modal
    const bootstrapModal = new bootstrap.Modal(errorModal);
    bootstrapModal.show();
}

/**
 * Closes the error modal by hiding it and removing any leftover backdrops.
 */
function closeErrorModal() {
    const errorModal = document.getElementById("errorModal");
    if (errorModal) {
        const bootstrapModal = bootstrap.Modal.getInstance(errorModal);
        bootstrapModal.hide();
    }

    // Remove any remaining modal-backdrop elements
    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        backdrop.remove();
    });
}

