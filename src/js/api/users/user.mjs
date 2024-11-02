import { registerURL, loginURL } from "../url.mjs";
import { displayErrorModal as displayModal } from "../url.mjs"; // Renaming for error messages

/**
 * Registers a new user with required fields and optional avatar
 * @param {string} name - Required username
 * @param {string} email - Required email
 * @param {string} password - Required password
 * @returns {object} - Result of the registration
 */
export async function registerUser(name, email, password) {
    const userData = { name, email, password };

    try {
        const response = await fetch(registerURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // No Authorization needed for registration
            body: JSON.stringify(userData)
        });
        const data = await response.json();

        if (!response.ok) {
            return handleAPIError(data, response.status);
        }

        clearLoginData();
        displayModal("Registration successful! Please log in."); // Success message for registration
        return { success: true, message: "Registration successful!" };
    } catch (error) {
        return handleError("An error occurred. Please try again.");
    }
}

/**
 * Logs in the user and stores token based on `rememberMe` selection
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {boolean} rememberMe - Flag to store session in `localStorage` or `sessionStorage`
 * @returns {object} - Result of the login
 */
export async function loginUser(email, password, rememberMe) {
    const loginDetails = { email, password };

    try {
        const response = await fetch(loginURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Authorization handled automatically in fetch setup
            body: JSON.stringify(loginDetails)
        });
        const data = await response.json();

        if (!response.ok) {
            return handleAPIError(data, response.status);
        }

        storeLoginData(data, rememberMe);
        displayModal("Login successful!"); // Success message for login
        return { success: true, message: "Login successful!", data };
    } catch (error) {
        return handleError("An error occurred while logging in. Please try again.");
    }
}

/**
 * Parses API error response and displays it in a modal
 * @param {object} data - Error response from the API
 * @param {number} statusCode - HTTP status code from the response
 * @returns {object} - Formatted error object for consistency
 */
function handleAPIError(data, statusCode) {
    const errors = (data.errors || []).map(error => ({
        code: error.code || "Unknown code",
        message: error.message || "Unknown error",
        path: error.path || []
    }));
    const errorMessage = errors.map(e => e.message).join("; ");
    displayModal(errorMessage);

    return {
        success: false,
        message: errorMessage,
        status: data.status || "error",
        statusCode: data.statusCode || statusCode
    };
}

/**
 * Displays a generic error message in a modal
 * @param {string} message - Message to display
 * @returns {object} - Standard error response object
 */
function handleError(message) {
    displayModal(message);
    return { success: false, message };
}

/**
 * Clears any stored login data from both local and session storage
 */
function clearLoginData() {
    localStorage.removeItem('loginData');
    sessionStorage.removeItem('loginData');
}

/**
 * Stores login data and access token in either local or session storage
 * @param {object} data - User data received from login response
 * @param {boolean} rememberMe - Flag for localStorage or sessionStorage
 */
function storeLoginData(data, rememberMe) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('loginData', JSON.stringify(data));

    if (data.data?.accessToken) {
        storage.setItem('accessToken', data.data.accessToken);
    }
}
