import { hideElement, revealElement } from "../../animation/fade.mjs";
import { createModalHeader } from "./modalBuilder.mjs";


/**
 * Displays a message inside the modal with a structured layout.
 * @param {HTMLElement} modalContent - The modal content container.
 * @param {string} messageToDisplay - The message text to display.
 * @param {string} messageType - The type of message (e.g., "info", "success", "error"). Defaults to "info".
 * @param {string} title - The title of the message (e.g., "404").
 */
export async function displayMessage(modalContent, messageToDisplay, messageType = "info", title = "Message") {
    // Validate modalContent
    if (!modalContent) {
        console.error("Modal content container not provided in displayMessage.");
        return;
    }

    // Clear existing content in modalContent
    modalContent.innerHTML = '';

    // Create modal-header with the title and close functionality
    const modalHeader = createModalHeader(title, async () => {
        try {
            await hideElement(modalContent);
        } catch (error) {
            console.error("Failed to hide the modal:", error);
        }
    });

    // Create modal-body
    const modalBody = document.createElement('div');
    modalBody.className = `modal-body message-container message-${messageType}`;
    modalBody.setAttribute('role', 'alert');

    const messageText = document.createElement('p');
    messageText.className = 'message-text';
    messageText.textContent = messageToDisplay;

    modalBody.appendChild(messageText);




    // Append sections to modalContent
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);


    // Reveal the modal content
    try {
        await revealElement(modalContent);
    } catch (error) {
        console.error("Failed to reveal the modal:", error);
    }
}