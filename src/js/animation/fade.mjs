/**
 * Hides an element with a fade-out effect.
 * @param {string|HTMLElement} element - The element or ID of the element to hide.
 */
export function hideElement(element) {
    const el = typeof element === 'string' ? document.getElementById(element) : element;
    const fadeDuration = 300;

    el.style.display = 'none';

    // if (el) {
    //     el.style.transition = `opacity ${fadeDuration}ms ease`;
    //     el.style.opacity = '0';
    //     setTimeout(() => {
    //         el.style.display = 'none';
    //     }, fadeDuration);
    //     console.log(el.id + " hidden");
    // }
}

/**
 * Reveals an element with a fade-in effect.
 * @param {string|HTMLElement} element - The element or ID of the element to reveal.
 */
export function revealElement(element) {
    const el = typeof element === 'string' ? document.getElementById(element) : element;
    const fadeDuration = 300;

    if (el) {
        el.style.display = 'block'; // Make the element visible
        el.style.opacity = '0';     // Set initial opacity to 0
        el.style.transition = `opacity ${fadeDuration}ms ease`; // Set up the fade-in transition

        // Slight delay to ensure display change is processed before opacity
        setTimeout(() => {
            el.style.opacity = '1'; // Fade in to full opacity
        }, 10); // Delay of 10ms to apply transition smoothly

        console.log(el.id + " revealed with fade-in");
    }
}