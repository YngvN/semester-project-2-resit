import { registerURL, loginURL } from "../url.mjs";

/**
 * Sends information to create a new user
 */
export async function registerUser(name, email, password) {
    const userData = { name, email, password };

    try {
        const response = await fetch(registerURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            // Use the structured error format
            const errorDetails = {
                code: data.errors?.[0]?.code || "Unknown error code",
                message: data.errors?.[0]?.message || "Unknown error",
                path: data.errors?.[0]?.path || [],
                status: data.status || "error",
                statusCode: data.statusCode || response.status
            };
            return { success: false, message: errorDetails.message };
        }

        // Clear any existing login data
        localStorage.removeItem('loginData');
        localStorage.removeItem('loggedIn');
        sessionStorage.removeItem('loginData');
        sessionStorage.removeItem('loggedIn');

        console.log("Create user success");
        return { success: true, message: "Registration successful!" };
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
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
            // Use the structured error format
            const errorDetails = {
                code: data.errors?.[0]?.code || "Unknown error code",
                message: data.errors?.[0]?.message || "Unknown error",
                path: data.errors?.[0]?.path || [],
                status: data.status || "error",
                statusCode: data.statusCode || response.status
            };
            alert(`Error: ${errorDetails.message}`);
            throw new Error(JSON.stringify(errorDetails));
        }

        // Store login data based on the rememberMe setting
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('loginData', JSON.stringify(data));
        storage.setItem('loggedIn', 'true'); // Set the login status

        console.log('Login successful:', data);
        return { success: true, message: 'Login successful', data };
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred while logging in. Please try again.');
        return { success: false, message: error.message };
    }
}
