// Render UI components and views
function renderUI(viewName) {
    console.log("Rendering view:", viewName);
    // Add dynamic rendering logic here
}

function updateDisplay(data) {
    const displayElement = document.getElementById('shop-display');
    if (displayElement) {
        displayElement.innerHTML = data;
    }
}
