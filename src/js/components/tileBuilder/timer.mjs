/**
 * Calculates the time left until a given end date and returns a formatted string.
 * @param {string|Date} endsAt - The end date of the auction or event.
 * @returns {string} A formatted string representing the time left.
 */
export function calculateTimeLeft(endsAt) {
    const now = new Date();
    const endDate = new Date(endsAt);
    const timeLeft = Math.max(0, endDate - now);

    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (daysLeft > 0) {
        return `${daysLeft} days left`;
    } else if (hoursLeft > 0) {
        return `${hoursLeft} hours, ${minutesLeft} minutes left`;
    } else {
        return `${minutesLeft} minutes left`;
    }
}
