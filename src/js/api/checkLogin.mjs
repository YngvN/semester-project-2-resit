// Function to check if a user is logged in
export function isLoggedIn() {
    // Check sessionStorage for login data
    let sessionUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (sessionUser && validateUser(sessionUser)) {
        return true;
    }

    // Check localStorage for login data
    let localUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (localUser && validateUser(localUser)) {
        return true;
    }

    // No valid login data found
    return false;
}

// Helper function to validate user against LoginData
function validateUser(user) {
    return LoginData.some(login =>
        login.username === user.username && login.token === user.token
    );
}