// Input handling for touch and mouse events
function setupInputs() {
    document.addEventListener('click', (event) => {
        // Handle click events across the app
        const target = event.target;
        if (target.matches('button')) {
            console.log("Button clicked:", target.innerText);
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    setupInputs();
});
