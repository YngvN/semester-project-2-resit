const baseURL = "https://api.noroff.dev/api/v1/auction/";
export const registerURL = baseURL + "auth/register";
export const loginURL = baseURL + "auth/login";

const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODcyLCJuYW1lIjoiVGVzdCIsImVtYWlsIjoidGVzdDEyM0BzdHVkLm5vcm9mZi5ubyIsImF2YXRhciI6bnVsbCwiY3JlZGl0cyI6MTAwMCwid2lucyI6W10sImlhdCI6MTcwMjA1MzYyOX0.7kCQWtGXsmwJw5gnSqCX4Kg-QROxkG6K9EBzh4_ItRk";

const defaultHeaders = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + accessToken,
};

/**
 * Makes a request based on the specified HTTP method and URL components
 * @param {string} category - First part of the URL
 * @param {string} id - (Optional) Second part to find items 
 * @param {string} subcategory - (Optional) Third part to find specific items
 * @param {string} method - (Optional) "POST", "PUT" or "DELETE"
 * @param {object} body - (Optional) Data to be sent or deleted
 * @param {string} filters - (Optional) Adds additional filters to the URL ex: _seller
 */
export async function makeRequest(category, id = '', subcategory = '', method = 'GET', body = null, filters = '') {
    let url = baseURL + category;
    if (id) {
        url += "/" + id;
        if (subcategory) {
            url += "/" + subcategory;
        }
    }

    // Only add '?' if filters exist
    if (filters) url += '?' + filters;

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

    console.log(`URL created for method ${method}: ${url}`);
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

    const options = {
        method: 'PUT',
        headers: defaultHeaders,
        body: JSON.stringify(body),
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
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
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log("Item successfully deleted from URL:", url);
    } catch (error) {
        console.error('Problem with DELETE request:', error);
    }
}


// const baseURL = "https://api.noroff.dev/api/v1/auction/";

// export const registerURL = baseURL + "auth/register";

// export const loginURL = baseURL + "auth/login";


// const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODcyLCJuYW1lIjoiVGVzdCIsImVtYWlsIjoidGVzdDEyM0BzdHVkLm5vcm9mZi5ubyIsImF2YXRhciI6bnVsbCwiY3JlZGl0cyI6MTAwMCwid2lucyI6W10sImlhdCI6MTcwMjA1MzYyOX0.7kCQWtGXsmwJw5gnSqCX4Kg-QROxkG6K9EBzh4_ItRk";


// const options = {
//     headers: {
//         Authorization: 'Bearer ' + accessToken,
//     },
// }


// /**
//  * Creates a URL and performs an action based on the specified HTTP method
//  * @param {string} category - First part of the url
//  * @param {string} id - (Optional) Second part to find items 
//  * @param {string} subcategory - (Optional) Third part to find specific items
//  * @param {string} method - (Optional) "POST", "PUT" or "DELETE"
//  * @param {object} body - (Optional) Data to be sent or deleted
//  * @param {string} filters - (Optional) Adds additional filters to the URL ex: _seller
//  */
// export async function createURL(category, id = '', subcategory = '', method = 'GET', body = null, filters = '') {
//     let url = baseURL + category;
//     if (id) {
//         url += "/" + id;
//         if (subcategory) {
//             url += "/" + subcategory;
//         }
//     }


//     url = url + '?' + filters;

//     try {
//         if (method === "POST") {
//             return await postData(url, body);
//         } else if (method === "PUT") {
//             return await putData(url, body);
//         } else if (method === "DELETE") {
//         } else {
//             return await fetchData(url);
//         }
//     } catch (error) {
//         console.error('Error with the request:', error);
//     }

//     console.log("URL created for method " + method + ": " + url);
// }


// /**
//  * Fetches data
//  * @param {string} url 
//  * @returns 
//  */
// async function fetchData(url) {
//     console.log("Recieving data to URL: " + url);

//     try {
//         const response = await fetch(url, options);
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();

//         console.log(data);

//         return data;
//     } catch (error) {
//         console.error('There was a problem fetching the dataset:', error);
//     }
// }


// /**
//  * 
//  * @param {string} url 
//  * @param {object} body 
//  * @returns 
//  */
// async function postData(url, body) {
//     console.log("Sending data to URL: " + url);

//     const options = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer ' + accessToken,
//         },
//         body: JSON.stringify(body)
//     };

//     try {
//         const response = await fetch(url, options);
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();

//         console.log("Response data: ", data);

//         return data;
//     } catch (error) {
//         console.error('There was a problem with the POST request:', error);
//     }
// }



// /**
//  * Sends a PUT request to the specified URL with the provided body data.
//  * @param {string} url - The URL to send the PUT request to.
//  * @param {object} body - The data to be sent with the PUT request.
//  * @returns {Promise<object>} - The response data from the PUT request.
//  */
// async function putData(url, body) {
//     console.log("Sending PUT request to URL: " + url);

//     const options = {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + accessToken
//         },
//         body: JSON.stringify(body)
//     };

//     try {
//         const response = await fetch(url, options);
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();

//         console.log("Response data from PUT request: ", data);

//         return data;
//     } catch (error) {
//         console.error('There was a problem with the PUT request:', error);
//     }
// }