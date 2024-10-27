import { registerURL, loginURL } from "../url.mjs";
import { displayErrorModal as displayModal } from "../url.mjs"; // Renaming for general usage

/**
 * Registers a new user with only the required fields and optional avatar
 * @param {string} name - Required username
 * @param {string} email - Required email
 * @param {string} password - Required password
 * @param {object} avatar - Optional avatar object with url and alt
 * @returns {object} - Result of the registration
 */
export async function registerUser(name, email, password, avatar = null) {
    const userData = { name, email, password };
    if (avatar) {
        userData.avatar = avatar;
    }

    console.log("Register URL:", registerURL);
    console.log("Request Payload:", JSON.stringify(userData));

    try {
        const response = await fetch(registerURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            const errors = data.errors?.map(error => ({
                code: error.code || "Unknown error code",
                message: error.message || "Unknown error",
                path: error.path || []
            })) || [{ message: "Unknown error" }];

            errors.forEach((error, index) => {
                console.error(`Error ${index + 1}:`, error);
            });

            const errorMessage = errors.map(e => e.message).join("; ");
            displayModal(errorMessage); // Show error in modal
            return {
                success: false,
                message: errorMessage,
                status: data.status || "error",
                statusCode: data.statusCode || response.status
            };
        }

        localStorage.removeItem('loginData');
        sessionStorage.removeItem('loginData');

        const successMessage = "Registration successful!";
        displayModal(successMessage); // Show success in modal
        console.log("User registered successfully");
        return { success: true, message: successMessage };
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        displayModal("An error occurred. Please try again.");
        return { success: false, message: "An error occurred. Please try again." };
    }
}


export async function loginUser(email, password, rememberMe) {
    const loginDetails = { email, password };

    try {
        const response = await fetch(loginURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginDetails)
        });

        const data = await response.json();

        if (!response.ok) {
            const errorDetails = {
                code: data.errors?.[0]?.code || "Unknown error code",
                message: data.errors?.[0]?.message || "Unknown error",
                path: data.errors?.[0]?.path || [],
                status: data.status || "error",
                statusCode: data.statusCode || response.status
            };
            displayModal(`Error: ${errorDetails.message}`);
            throw new Error(JSON.stringify(errorDetails));
        }

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('loginData', JSON.stringify(data));
        if (data.data?.accessToken) {
            storage.setItem('accessToken', data.data.accessToken);
        }

        const successMessage = "Login successful!";
        displayModal(successMessage); // Show success in modal
        console.log('Login successful:', data);
        return { success: true, message: successMessage, data };
    } catch (error) {
        console.error('Error during login:', error);
        displayModal('An error occurred while logging in. Please try again.');
        return { success: false, message: error.message };
    }
}
