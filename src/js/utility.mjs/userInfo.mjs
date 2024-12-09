export function getUSerData() {

    const userData = JSON.parse(localStorage.getItem('loginData') || sessionStorage.getItem('loginData') || '{}');

    return userData;
}

// Helper function to set loginData back to storage
export function setUserData(data) {
    const storage = localStorage.getItem("loginData") ? localStorage : sessionStorage;
    storage.setItem("loginData", JSON.stringify(data));
}



