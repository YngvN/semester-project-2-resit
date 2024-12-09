import { revealElement, hideElement } from "../../animation/fade.mjs";
import { createModalHeader } from "./modalBuilder.mjs";

/**
 * Builds and displays an update modal for the user profile.
 * @param {HTMLElement} modalContent - The modal content container.
 * @param {Object} userData - User data to prefill in the form.
 * @param {Function} onUpdate - Callback to handle the update submission.
 */
export function buildUpdateModal(modalContent, userData, onUpdate) {
    modalContent.innerHTML = ''; // Clear existing modal content

    // Create modal header
    const modalHeader = createModalHeader("Edit Profile", async () => {
        try {
            await hideElement(modalContent.closest('.modal'));
            modalContent.closest('.modal').remove();
        } catch (error) {
            console.error("Failed to hide the modal:", error);
        }
    });

    // Append modal header to the modal content
    modalContent.appendChild(modalHeader);

    // Create a container for the form
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';

    // Create a form for updating the profile
    const form = document.createElement('form');
    form.id = 'updateProfileForm';

    // Avatar field with preview
    const avatarGroup = document.createElement('div');
    avatarGroup.className = 'mb-3 text-center';

    const avatarPreview = document.createElement('img');
    avatarPreview.src = userData.avatar || 'default-avatar.png';
    avatarPreview.alt = 'Avatar Preview';
    avatarPreview.className = 'mb-3';
    avatarPreview.style.width = '100px';
    avatarPreview.style.height = '100px';

    const avatarLabel = document.createElement('label');
    avatarLabel.className = 'form-label';
    avatarLabel.setAttribute('for', 'avatar');
    avatarLabel.textContent = 'Avatar';

    const avatarInput = document.createElement('input');
    avatarInput.type = 'url';
    avatarInput.className = 'form-control';
    avatarInput.id = 'avatar';
    avatarInput.name = 'avatar';
    avatarInput.value = userData.avatar || '';

    // Update avatar preview on input change
    avatarInput.addEventListener('input', () => {
        setTimeout(() => {
            avatarPreview.src = avatarInput.value || 'default-avatar.png';
        }, 1000);
    });

    avatarGroup.appendChild(avatarPreview);
    avatarGroup.appendChild(avatarLabel);
    avatarGroup.appendChild(avatarInput);
    form.appendChild(avatarGroup);

    // Banner field with preview
    const bannerGroup = document.createElement('div');
    bannerGroup.className = 'mb-3 text-center';

    const bannerPreview = document.createElement('img');
    bannerPreview.src = userData.banner || 'default-banner.jpg';
    bannerPreview.alt = 'Banner Preview';
    bannerPreview.className = 'img-fluid rounded mb-3';
    bannerPreview.style.maxHeight = '150px';
    bannerPreview.style.width = '100%';

    const bannerLabel = document.createElement('label');
    bannerLabel.className = 'form-label';
    bannerLabel.setAttribute('for', 'banner');
    bannerLabel.textContent = 'Banner';

    const bannerInput = document.createElement('input');
    bannerInput.type = 'url';
    bannerInput.className = 'form-control';
    bannerInput.id = 'banner';
    bannerInput.name = 'banner';
    bannerInput.value = userData.banner || '';

    // Update banner preview on input change
    bannerInput.addEventListener('input', () => {
        setTimeout(() => {
            bannerPreview.src = bannerInput.value || 'default-banner.jpg';
        }, 1000);
    });

    bannerGroup.appendChild(bannerPreview);
    bannerGroup.appendChild(bannerLabel);
    bannerGroup.appendChild(bannerInput);
    form.appendChild(bannerGroup);

    // Bio field
    const bioGroup = document.createElement('div');
    bioGroup.className = 'mb-3';

    const bioLabel = document.createElement('label');
    bioLabel.className = 'form-label';
    bioLabel.setAttribute('for', 'bio');
    bioLabel.textContent = 'Bio';

    const bioInput = document.createElement('textarea');
    bioInput.className = 'form-control';
    bioInput.id = 'bio';
    bioInput.name = 'bio';
    bioInput.rows = 4;
    bioInput.value = userData.bio || '';

    bioGroup.appendChild(bioLabel);
    bioGroup.appendChild(bioInput);
    form.appendChild(bioGroup);

    // Create Save and Cancel buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'modal-footer';

    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.className = 'btn btn-success me-2';
    saveButton.textContent = 'Save Changes';
    saveButton.addEventListener('click', () => {
        const formData = new FormData(form);
        const updatedValues = Object.fromEntries(formData.entries());
        onUpdate(updatedValues); // Trigger the update callback
    });

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'btn btn-secondary';
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', async () => {
        try {
            await hideElement(modalContent.closest('.modal'));
            modalContent.closest('.modal').remove();
        } catch (error) {
            console.error("Failed to close the modal:", error);
        }
    });

    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(cancelButton);
    form.appendChild(buttonContainer);

    // Append the form to the modal body
    modalBody.appendChild(form);

    // Append the modal body to the modal content
    modalContent.appendChild(modalBody);
}
