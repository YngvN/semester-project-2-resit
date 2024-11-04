
// import { makeRequest, displayErrorModal } from "../../js/api/url.mjs";

// export function initCreateListingForm() {
//     const createListingButton = document.getElementById("createListingButton");
//     const createListingModal = new bootstrap.Modal(document.getElementById("createListingModal"));
//     const createListingForm = document.getElementById("createListingForm");
//     const mediaFieldsContainer = document.getElementById("mediaFieldsContainer");
//     const addImageButton = document.getElementById("addImageButton");

//     // Open the modal when the button is clicked
//     createListingButton.addEventListener("click", () => {
//         createListingModal.show();
//     });

//     // Add new media field set on button click
//     addImageButton.addEventListener("click", () => {
//         const mediaInputGroup = document.createElement("div");
//         mediaInputGroup.classList.add("media-input-group", "mb-2");

//         mediaInputGroup.innerHTML = `
//             <input type="url" class="form-control mb-2" name="mediaUrl" placeholder="Media URL" required>
//             <input type="text" class="form-control" name="mediaAlt" placeholder="Alt Text">
//         `;
//         mediaFieldsContainer.appendChild(mediaInputGroup);
//     });

//     // Handle form submission
//     createListingForm.addEventListener("submit", async (event) => {
//         event.preventDefault();

//         // Gather form data
//         const title = document.getElementById("title").value;
//         const description = document.getElementById("description").value;
//         const tags = document.getElementById("tags").value.split(",").map(tag => tag.trim());
//         const endsAt = new Date(document.getElementById("endsAt").value).toISOString();

//         // Collect all media URLs and alt texts
//         const media = Array.from(mediaFieldsContainer.querySelectorAll(".media-input-group")).map(group => {
//             const url = group.querySelector("input[name='mediaUrl']").value;
//             const alt = group.querySelector("input[name='mediaAlt']").value;
//             return { url, alt };
//         });

//         // Prepare the payload for the API
//         const listingData = {
//             title,
//             description,
//             tags,
//             media,
//             endsAt
//         };

//         try {
//             // Send a POST request to create the listing with auth required
//             const response = await makeRequest("listings", "", "", "POST", listingData, {}, true);

//             if (response && response.success) {
//                 alert("Listing created successfully!");
//                 createListingModal.hide();
//                 createListingForm.reset();
//                 mediaFieldsContainer.innerHTML = ""; // Reset media fields
//                 addImageButton.click(); // Add initial media input fields back
//             } else {
//                 console.error("Failed to create listing:", response);
//                 throw new Error("Failed to create listing. Please check your input and try again.");
//             }
//         } catch (error) {
//             console.error("Error creating listing:", error);
//             displayErrorModal("An error occurred while creating the listing. Please try again.");
//         }
//     });
// }
import { makeRequest, displayErrorModal } from "../../js/api/url.mjs";

export function initCreateListingForm() {
    const createListingButton = document.getElementById("createListingButton");
    const createListingModal = new bootstrap.Modal(document.getElementById("createListingModal"));
    const createListingForm = document.getElementById("createListingForm");
    const mediaFieldsContainer = document.getElementById("mediaFieldsContainer");
    const addImageButton = document.getElementById("addImageButton");

    // Open the modal when the button is clicked
    createListingButton.addEventListener("click", () => {
        createListingModal.show();
    });

    // Add new media field set on button click
    addImageButton.addEventListener("click", () => {
        const mediaInputGroup = document.createElement("div");
        mediaInputGroup.classList.add("media-input-group", "mb-2");

        mediaInputGroup.innerHTML = `
            <input type="url" class="form-control mb-2" name="mediaUrl" placeholder="Media URL" required>
            <input type="text" class="form-control" name="mediaAlt" placeholder="Alt Text">
        `;
        mediaFieldsContainer.appendChild(mediaInputGroup);
    });

    // Handle form submission
    createListingForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Gather form data
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const tags = document.getElementById("tags").value.split(",").map(tag => tag.trim());
        const endsAt = new Date(document.getElementById("endsAt").value).toISOString();

        // Collect all media URLs and alt texts
        const media = Array.from(mediaFieldsContainer.querySelectorAll(".media-input-group")).map(group => {
            const url = group.querySelector("input[name='mediaUrl']").value;
            const alt = group.querySelector("input[name='mediaAlt']").value;
            return { url, alt };
        });

        // Prepare the payload for the API
        const listingData = {
            title,
            description,
            tags,
            media,
            endsAt
        };

        try {
            // Send a POST request to create the listing with auth required
            const response = await makeRequest("listings", "", "", "POST", listingData, {}, true);

            // Check if the response contains the expected data
            if (response && response.data && response.data.id) {
                displayErrorModal("Listing created successfully!");
                createListingModal.hide();
                createListingForm.reset();
                mediaFieldsContainer.innerHTML = ""; // Reset media fields
                addImageButton.click(); // Add initial media input fields back
            } else {
                console.error("Unexpected response format:", response);
                throw new Error("Failed to create listing. Please check your input and try again.");
            }
        } catch (error) {
            console.error("Error creating listing:", error);
            displayErrorModal("An error occurred while creating the listing. Please try again.");
        }
    });
}
