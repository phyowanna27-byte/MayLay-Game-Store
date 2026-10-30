// Game Store / Mini App Core Logic
let userBalance = 0;

function initGame() {
    console.log("May Lay Game Store Initialized");
    loadUserData();
}

function loadUserData() {
    // Fetch user or Telegram WebApp data
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.expand();
        console.log("Telegram User:", tg.initDataUnsafe);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    initGame();
});
