// import { makeRequest } from "../api/url.mjs";

// let countdownInterval;  // Global variable to store the interval ID

// export function openListingModal(listingObject) {
//     const modalTitle = document.getElementById('listingModalLabel');
//     const modalBody = document.getElementById('modalBody');

//     if (!modalTitle || !modalBody) {
//         console.error('Modal elements not found in the DOM');
//         return;
//     }

//     modalTitle.textContent = listingObject.title;

//     // Helper function to calculate and format time left
//     function getTimeLeft(endsAt) {
//         const endTime = new Date(endsAt);
//         const now = new Date();
//         const timeDifference = endTime - now;

//         if (timeDifference <= 0) {
//             clearInterval(countdownInterval);
//             return "Auction ended";
//         }

//         const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
//         const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//         const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
//         const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

//         return `${days > 0 ? days + " days, " : ""}${hours} hours, ${minutes} minutes, ${seconds} seconds`;
//     }

//     // Generate the image carousel if there are multiple images
//     let imagesHTML = '';
//     if (listingObject.media && listingObject.media.length > 1) {
//         imagesHTML = `
//             <div id="imageCarousel" class="carousel slide" data-bs-ride="carousel">
//                 <div class="carousel-inner">
//                     ${listingObject.media.map((image, index) => `
//                         <div class="carousel-item ${index === 0 ? 'active' : ''}">
//                             <img src="${image.url}" class="d-block w-100 img-fluid" alt="${image.alt || 'Image of ' + listingObject.title}"
//                                  style="height: 300px; object-fit: cover;">
//                         </div>
//                     `).join('')}
//                 </div>
//                 <button class="carousel-control-prev" type="button" data-bs-target="#imageCarousel" data-bs-slide="prev">
//                     <span class="carousel-control-prev-icon" aria-hidden="true"></span>
//                     <span class="visually-hidden">Previous</span>
//                 </button>
//                 <button class="carousel-control-next" type="button" data-bs-target="#imageCarousel" data-bs-slide="next">
//                     <span class="carousel-control-next-icon" aria-hidden="true"></span>
//                     <span class="visually-hidden">Next</span>
//                 </button>
//             </div>
//         `;
//     } else {
//         imagesHTML = `
//             <img src="${listingObject.media && listingObject.media.length > 0 ? listingObject.media[0].url : 'default-listing-image.jpg'}" 
//                  alt="${listingObject.media && listingObject.media.length > 0 ? listingObject.media[0].alt : 'Default image'}" 
//                  class="img-fluid mb-3" style="width: 100%; height: 300px; object-fit: cover;">
//         `;
//     }

//     // Set the modal body content with the carousel or single image and other listing details
//     modalBody.innerHTML = `
//         ${imagesHTML}
//         <p><strong>Seller:</strong> ${listingObject.seller?.name || 'Unknown'}</p>
//         <p><strong>Bid Count:</strong> ${listingObject._count?.bids || 0} bids</p>
//         <p><strong>Time Left:</strong> <span id="timeLeft">${getTimeLeft(listingObject.endsAt)}</span></p>
//         <p><strong>Current Price:</strong> ${listingObject.bids && listingObject.bids.length > 0
//             ? `$${listingObject.bids[listingObject.bids.length - 1].amount}`
//             : 'No bids'}</p>
//         <p><strong>Description:</strong> ${listingObject.description || 'No description available'}</p>
//         <button id="bidButton" class="btn btn-primary mt-3">Place a Bid</button>
//     `;

//     // Start a countdown interval
//     clearInterval(countdownInterval);
//     countdownInterval = setInterval(() => {
//         const timeLeftElement = document.getElementById('timeLeft');
//         if (timeLeftElement) {
//             timeLeftElement.textContent = getTimeLeft(listingObject.endsAt);
//         }
//     }, 1000);

//     // Show the modal
//     try {
//         const listingModal = new bootstrap.Modal(document.getElementById('listingModal'));
//         listingModal.show();

//         // Clear interval when modal is hidden
//         document.getElementById('listingModal').addEventListener('hidden.bs.modal', () => {
//             clearInterval(countdownInterval);
//         });
//     } catch (error) {
//         console.error('Bootstrap modal error:', error);
//     }

//     // Remove any existing listeners on the bid button before adding a new one
//     const bidButton = document.getElementById('bidButton');
//     bidButton.removeEventListener('click', openBidPopup);
//     bidButton.addEventListener('click', openBidPopup);
// }

// // Function to open the bid popup and display user's credits
// function openBidPopup() {
//     const loginData = JSON.parse(localStorage.getItem('loginData') || sessionStorage.getItem('loginData') || '{}');
//     const availableCredits = loginData?.userData?.credits || 0;

//     const bidPopup = document.createElement('div');
//     bidPopup.className = 'modal fade';
//     bidPopup.id = 'bidPopupModal';
//     bidPopup.innerHTML = `
//         <div class="modal-dialog modal-dialog-centered">
//             <div class="modal-content">
//                 <div class="modal-header">
//                     <h5 class="modal-title">Place Your Bid</h5>
//                     <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                 </div>
//                 <div class="modal-body">
//                     <p><strong>Available Credits:</strong> $${availableCredits}</p>
//                     <div class="form-group">
//                         <label for="bidAmount">Enter your bid:</label>
//                         <input type="number" id="bidAmount" class="form-control" placeholder="Your bid amount" min="1" required>
//                     </div>
//                 </div>
//                 <div class="modal-footer">
//                     <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
//                     <button type="button" id="submitBid" class="btn btn-primary">Submit Bid</button>
//                 </div>
//             </div>
//         </div>
//     `;

//     document.body.appendChild(bidPopup);

//     const bidPopupModal = new bootstrap.Modal(document.getElementById('bidPopupModal'));
//     bidPopupModal.show();

//     const submitBidButton = document.getElementById('submitBid');
//     submitBidButton.removeEventListener('click', handleBidSubmission);
//     submitBidButton.addEventListener('click', handleBidSubmission);

//     bidPopupModal._element.addEventListener('hidden.bs.modal', () => {
//         bidPopupModal.dispose();
//         bidPopup.remove();
//     });
// }

// // Handle bid submission logic
// function handleBidSubmission() {
//     const bidAmount = parseFloat(document.getElementById('bidAmount').value);
//     const loginData = JSON.parse(localStorage.getItem('loginData') || sessionStorage.getItem('loginData') || '{}');
//     const availableCredits = loginData?.userData?.credits || 0;

//     if (isNaN(bidAmount) || bidAmount <= 0) {
//         alert('Please enter a valid bid amount.');
//         return;
//     }

//     if (bidAmount > availableCredits) {
//         alert('Insufficient credits.');
//         return;
//     }

//     console.log(`Bid of $${bidAmount} placed successfully!`);
//     bootstrap.Modal.getInstance(document.getElementById('bidPopupModal')).hide();
// }

// export default { openListingModal };


import { makeRequest } from "../api/url.mjs";

let countdownInterval;

export async function openListingModal(listingId) {
    // Fetch the listing data using makeRequest
    const listingData = await makeRequest(`listings/${listingId}`, '', '', 'GET', null, { _seller: true, _bids: true }, false);

    if (!listingData || !listingData.data) {
        console.error('Listing data could not be retrieved');
        return;
    }

    const listingObject = listingData.data;

    const modalTitle = document.getElementById('listingModalLabel');
    const modalBody = document.getElementById('modalBody');

    if (!modalTitle || !modalBody) {
        console.error('Modal elements not found in the DOM');
        return;
    }

    modalTitle.textContent = listingObject.title;

    function getTimeLeft(endsAt) {
        const endTime = new Date(endsAt);
        const now = new Date();
        const timeDifference = endTime - now;

        if (timeDifference <= 0) {
            clearInterval(countdownInterval);
            return "Auction ended";
        }

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        return `${days > 0 ? days + " days, " : ""}${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    }

    let imagesHTML = '';
    if (listingObject.media && listingObject.media.length > 1) {
        imagesHTML = `
            <div id="imageCarousel" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    ${listingObject.media.map((image, index) => `
                        <div class="carousel-item ${index === 0 ? 'active' : ''}">
                            <img src="${image.url}" class="d-block w-100 img-fluid" alt="${image.alt || 'Image of ' + listingObject.title}"
                                 style="height: 300px; object-fit: cover;">
                        </div>
                    `).join('')}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#imageCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#imageCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        `;
    } else {
        imagesHTML = `
            <img src="${listingObject.media && listingObject.media.length > 0 ? listingObject.media[0].url : 'default-listing-image.jpg'}" 
                 alt="${listingObject.media && listingObject.media.length > 0 ? listingObject.media[0].alt : 'Default image'}" 
                 class="img-fluid mb-3" style="width: 100%; height: 300px; object-fit: cover;">
        `;
    }

    modalBody.innerHTML = `
        ${imagesHTML}
        <p><strong>Seller:</strong> ${listingObject.seller?.name || 'Unknown'}</p>
        <p><strong>Bid Count:</strong> ${listingObject._count?.bids || 0} bids</p>
        <p><strong>Time Left:</strong> <span id="timeLeft">${getTimeLeft(listingObject.endsAt)}</span></p>
        <p><strong>Current Price:</strong> ${listingObject.bids && listingObject.bids.length > 0
            ? `$${listingObject.bids[listingObject.bids.length - 1].amount}`
            : 'No bids'}</p>
        <p><strong>Description:</strong> ${listingObject.description || 'No description available'}</p>
        <button id="bidButton" class="btn btn-primary mt-3">Place a Bid</button>
        <button id="viewBidsButton" class="btn btn-secondary mt-3 ms-2">View Bids</button>
    `;

    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        const timeLeftElement = document.getElementById('timeLeft');
        if (timeLeftElement) {
            timeLeftElement.textContent = getTimeLeft(listingObject.endsAt);
        }
    }, 1000);

    try {
        const listingModal = new bootstrap.Modal(document.getElementById('listingModal'));
        listingModal.show();

        document.getElementById('listingModal').addEventListener('hidden.bs.modal', () => {
            clearInterval(countdownInterval);
        });
    } catch (error) {
        console.error('Bootstrap modal error:', error);
    }

    const bidButton = document.getElementById('bidButton');
    bidButton.removeEventListener('click', openBidPopup);
    bidButton.addEventListener('click', openBidPopup);

    const viewBidsButton = document.getElementById('viewBidsButton');
    viewBidsButton.removeEventListener('click', () => viewBidHistory(listingObject.bids));
    viewBidsButton.addEventListener('click', () => viewBidHistory(listingObject.bids));
}

// Function to open bid history modal
function viewBidHistory(bids) {
    const bidHistoryModal = document.createElement('div');
    bidHistoryModal.className = 'modal fade';
    bidHistoryModal.id = 'bidHistoryModal';
    bidHistoryModal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Bid History</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    ${bids.length > 0 ? bids.map(bid => `
                        <p><strong>Bidder:</strong> ${bid.bidder.name || 'Anonymous'} - <strong>Amount:</strong> $${bid.amount}</p>
                    `).join('') : '<p>No bids available.</p>'}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(bidHistoryModal);

    const bidHistoryModalInstance = new bootstrap.Modal(document.getElementById('bidHistoryModal'));
    bidHistoryModalInstance.show();

    bidHistoryModalInstance._element.addEventListener('hidden.bs.modal', () => {
        bidHistoryModalInstance.dispose();
        bidHistoryModal.remove();
    });
}

// Function to open the bid popup and display user's credits
function openBidPopup() {
    const loginData = JSON.parse(localStorage.getItem('loginData') || sessionStorage.getItem('loginData') || '{}');
    const availableCredits = loginData?.userData?.credits || 0;

    const bidPopup = document.createElement('div');
    bidPopup.className = 'modal fade';
    bidPopup.id = 'bidPopupModal';
    bidPopup.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Place Your Bid</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p><strong>Available Credits:</strong> $${availableCredits}</p>
                    <div class="form-group">
                        <label for="bidAmount">Enter your bid:</label>
                        <input type="number" id="bidAmount" class="form-control" placeholder="Your bid amount" min="1" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" id="submitBid" class="btn btn-primary">Submit Bid</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(bidPopup);

    const bidPopupModal = new bootstrap.Modal(document.getElementById('bidPopupModal'));
    bidPopupModal.show();

    const submitBidButton = document.getElementById('submitBid');
    submitBidButton.removeEventListener('click', handleBidSubmission);
    submitBidButton.addEventListener('click', handleBidSubmission);

    bidPopupModal._element.addEventListener('hidden.bs.modal', () => {
        bidPopupModal.dispose();
        bidPopup.remove();
    });
}

// Handle bid submission logic
function handleBidSubmission() {
    const bidAmount = parseFloat(document.getElementById('bidAmount').value);
    const loginData = JSON.parse(localStorage.getItem('loginData') || sessionStorage.getItem('loginData') || '{}');
    const availableCredits = loginData?.userData?.credits || 0;

    if (isNaN(bidAmount) || bidAmount <= 0) {
        alert('Please enter a valid bid amount.');
        return;
    }

    if (bidAmount > availableCredits) {
        alert('Insufficient credits.');
        return;
    }

    console.log(`Bid of $${bidAmount} placed successfully!`);
    bootstrap.Modal.getInstance(document.getElementById('bidPopupModal')).hide();
}


export default { openListingModal };
