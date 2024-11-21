import { buildListingTiles } from "../../js/components/tileBuilder/tileCategory.mjs";

document.addEventListener("DOMContentLoaded", () => {
    console.log('Home.mjs loaded');
    buildListingTiles().then(() => {
        console.log('buildListingTiles function completed');
    });
    // Event listener to remove all modal backdrops when a modal is hidden
    document.addEventListener("hidden.bs.modal", () => {
        document.querySelectorAll(".modal-backdrop").forEach((backdrop) => backdrop.remove());
    });

    // Also, remove backdrops when clicking outside the modal
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("modal")) {
            document.querySelectorAll(".modal-backdrop").forEach((backdrop) => backdrop.remove());
        }
    });
});