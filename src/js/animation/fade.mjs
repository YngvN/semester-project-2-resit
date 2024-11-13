/**
 * Hides an element with a fade-out effect.
 * @param {string|HTMLElement} element - The element or ID of the element to hide.
 */
export function hideElement(element) {
    const el = typeof element === 'string' ? document.getElementById(element) : element;
    const fadeDuration = 300;

    el.style.display = 'none';
    // console.log(el.id + " hidden with fade-out");

}

/**
 * Reveals an element with a fade-in effect.
 * @param {string|HTMLElement} element - The element or ID of the element to reveal.
 */
export function revealElement(element) {
    const el = typeof element === 'string' ? document.getElementById(element) : element;
    const fadeDuration = 300;

    if (el) {
        el.style.display = 'flex';
        el.style.opacity = '0';
        el.style.transition = `opacity ${fadeDuration}ms ease`;


        setTimeout(() => {
            el.style.opacity = '1';
        }, 10);

        // console.log(el.id + " revealed with fade-in");
    }
}