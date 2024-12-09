import { createModalHeader } from "./modalBuilder.mjs";
import { hideElement, revealElement } from "../../animation/fade.mjs";
import { makeRequest } from "../../api/url.mjs";
import { buildModal } from "./modalBuilder.mjs";

/**
 * Displays a modal for creating a new listing.
 * @param {HTMLElement} modalContent - The modal content container.
 * @param {string} title - The title of the modal (default: "Create New Listing").
 */
export function createNewListingModal(modalContent, title = "Create New Listing") {
    if (!modalContent) {
        console.error("Modal content container not provided.");
        return;
    }

    // Clear existing content
    modalContent.innerHTML = '';

    // Create modal header
    const modalHeader = createModalHeader(title, async () => {
        try {
            await hideElement(modalContent);
        } catch (error) {
            console.error("Failed to hide the modal:", error);
        }
    });

    // Create modal body
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body body-create-listing';

    modalBody.innerHTML = `
        <form id="createListingForm">
            <div class="mb-3">
                <label for="title" class="form-label">Title</label>
                <input type="text" class="form-control" id="title" required>
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea class="form-control" id="description"></textarea>
            </div>
            <div class="mb-3">
                <label for="tags" class="form-label">Tags (comma-separated)</label>
                <input type="text" class="form-control" id="tags">
            </div>
            <div id="mediaFieldsContainer" class="mb-3">
                <label class="form-label">Media</label>
                <div class="media-input-group mb-2">
                    <input type="url" class="form-control mb-2" name="mediaUrl" placeholder="Media URL" required>
                    <input type="text" class="form-control" name="mediaAlt" placeholder="Alt Text">
                </div>
            </div>
            <button type="button" id="addImageButton" class="btn btn-secondary mb-3">+ Add Image</button>
            <div class="mb-3">
                <label for="endsAt" class="form-label">Ends At</label>
                <input type="datetime-local" class="form-control" id="endsAt" required>
            </div>
            <div classname="modal-footer">
                <button type="submit" class="btn btn-primary">Submit Listing</button>
            </div>
        </form>


    `;

    // Append header and body to modal content
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);

    // Get references to form elements
    const form = modalBody.querySelector("#createListingForm");
    const addImageButton = modalBody.querySelector("#addImageButton");
    const mediaFieldsContainer = modalBody.querySelector("#mediaFieldsContainer");

    // Add event listener to add new media fields
    addImageButton.addEventListener("click", () => {
        const mediaInputGroup = document.createElement("div");
        mediaInputGroup.className = "media-input-group mb-2";
        mediaInputGroup.innerHTML = `
            <input type="url" class="form-control mb-2" name="mediaUrl" placeholder="Media URL" required>
            <input type="text" class="form-control" name="mediaAlt" placeholder="Alt Text">
        `;
        mediaFieldsContainer.appendChild(mediaInputGroup);
    });

    // Handle form submission
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Gather form data
        const title = form.querySelector("#title").value;
        const description = form.querySelector("#description").value;
        const tags = form.querySelector("#tags").value.split(",").map(tag => tag.trim());
        const endsAt = new Date(form.querySelector("#endsAt").value).toISOString();
        const media = Array.from(mediaFieldsContainer.querySelectorAll(".media-input-group")).map(group => ({
            url: group.querySelector("input[name='mediaUrl']").value,
            alt: group.querySelector("input[name='mediaAlt']").value,
        }));

        // Validate input
        if (!title || !description || new Date(endsAt) <= new Date()) {
            alert("Please fill out all required fields and ensure the end date is in the future.");
            return;
        }

        // Prepare data for the API
        const listingData = { title, description, tags, endsAt, media };

        try {
            const response = await makeRequest("listings", "", "", "POST", listingData, {}, true);

            if (response?.data?.id) {
                buildModal(null, "Listing created successfully!", "success", { dismissible: true });
                form.reset();
                mediaFieldsContainer.innerHTML = `
                    <div class="media-input-group mb-2">
                        <input type="url" class="form-control mb-2" name="mediaUrl" placeholder="Media URL" required>
                        <input type="text" class="form-control" name="mediaAlt" placeholder="Alt Text">
                    </div>
                `;
            } else {
                throw new Error("Unexpected response from server.");
            }
        } catch (error) {
            console.error("Error creating listing:", error);
            buildModal(null, "Failed to create listing. Please try again.", "error", { dismissible: true });
        }
    });

    // Reveal modal content
    try {
        revealElement(modalContent);
    } catch (error) {
        console.error("Failed to reveal the modal:", error);
    }
}
