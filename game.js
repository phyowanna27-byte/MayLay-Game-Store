// Game Store / Mini App Core Logic
let userBalance = 0;
let currentUser = { name: "Guest", photo: "" };

function initGame() {
    console.log("May Lay Game Store Initialized");
    loadUserData();
}

function loadUserData() {
    // Fetch user or Telegram WebApp data
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.expand();
        
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            const user = tg.initDataUnsafe.user;
            currentUser.name = user.first_name || "User";
            currentUser.photo = user.photo_url || "";
            console.log("Telegram User:", user);
            
            // Profile UI ပေါ်မှာ နာမည်နဲ့ ပုံပြရန်
            updateProfileUI(currentUser.name, currentUser.photo);
        }
    }
}

function updateProfileUI(name, photo) {
    const profileSection = document.getElementById('user-profile-section');
    if (profileSection) {
        profileSection.innerHTML = `
            <div class="flex items-center space-x-2">
                <div class="w-8 h-8 rounded-full bg-pink-400 overflow-hidden">
                    ${photo ? `<img src="${photo}" class="w-full h-full object-cover">` : ''}
                </div>
                <div>
                    <div class="text-xs font-bold text-gray-800">${name}</div>
                    <div class="text-[9px] text-emerald-600 font-semibold">Online</div>
                </div>
            </div>
        `;
    }
}

// Telegram Bot ဆီသို့ အော်ဒါအချက်အလက် ပို့ရန် Function (Token နဲ့ Chat ID ထည့်ပြီးသား)
function sendOrderToTelegram(orderDetails) {
    const botToken = '7851966567:AAGj_K70D5z3q8LgWv9nZ2xJ8m4P6s1Q2yE'; // ဝန ပေးထားတဲ့ Bot Token
    const chatId = '6432109875';                                      // ဝန ပေးထားတဲ့ Chat ID
    
    const message = `🛍️ အော်ဒါအသစ်ဝင်ပါပြီ!\n\n` +
                    `👤 ဝယ်ယူသူ: ${orderDetails.name || currentUser.name}\n` +
                    `📦 ဝယ်ယူသည့်ပစ္စည်း: ${orderDetails.item}\n` +
                    `💰 ကျသင့်ငွေ: ${orderDetails.price} THB`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                console.log("Order sent to Telegram successfully!");
            } else {
                console.error("Failed to send order:", data);
            }
        })
        .catch(error => console.error("Error sending order:", error));
}

window.addEventListener('DOMContentLoaded', () => {
    initGame();
});
