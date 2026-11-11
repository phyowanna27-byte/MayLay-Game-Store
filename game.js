// Game Store / Mini App Core Logic
let userBalance = 0;
let currentUser = { name: "Guest", photo: "" };

function initGame() {
    console.log("May Lay Game Store Initialized");
    loadUserData();
}

function loadUserData() {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.expand();
        
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            const user = tg.initDataUnsafe.user;
            currentUser.name = user.first_name || "User";
            currentUser.photo = user.photo_url || "";
            console.log("Telegram User:", user);
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

// 🎮 Game ID စစ်ဆေးခြင်း (RapidAPI Hub ကို အသုံးပြုရန်)[span_2](start_span)[span_2](end_span)
async function fetchPlayerName() {
    const game = document.getElementById('game-select').value; // ဥပမာ: mobile-legends, pubg, hok
    const playerId = document.getElementById('player-id').value;
    const zoneId = document.getElementById('zone-id').value;
    
    const accountFoundBox = document.getElementById('account-found-box');
    const nicknameField = document.getElementById('nickname-result');
    const serverField = document.getElementById('server-result');

    if (!playerId) {
        alert("ကျေးဇူးပြု၍ Game UID ထည့်ပါ။");
        return;
    }

    // RapidAPI Endpoint (ကိုယ်သုံးမယ့် API ရဲ့ URL နဲ့ Host ကို ထည့်ရန်)[span_3](start_span)[span_3](end_span)
    const apiUrl = `https://id-game-checker.p.rapidapi.com/check?game_code=${game}&user_id=${playerId}&zone_id=${zoneId || ''}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY', // ကိုယ့်ရဲ့ RapidAPI Key ကို ဤနေရာတွင် ထည့်ပါ
                'X-RapidAPI-Host': 'id-game-checker.p.rapidapi.com'
            }
        });
        const data = await response.json();

        // API မှ ရလာသော နာမည် (JSON format အလျောက်)[span_4](start_span)[span_4](end_span)
        const username = data.username || data.PlayerName || data.name;

        if (response.ok && username) {
            if (nicknameField) nicknameField.innerText = username;
            if (serverField) serverField.innerText = zoneId ? zoneId : "N/A";
            if (accountFoundBox) accountFoundBox.style.display = "block";
        } else {
            alert("ကစားသမား အချက်အလက် မတွေ့ရှိပါ။ ID သို့မဟုတ် Zone မှားနေပါသည် ။");
            if (accountFoundBox) accountFoundBox.style.display = "none";
        }
    } catch (error) {
        console.error("API Error:", error);
        alert("ချိတ်ဆက်မှု အမှားအယွင်း ရှိပါသည်။");
    }
}

// Telegram Bot ဆီသို့ အော်ဒါအချက်အလက် ပို့ရန် Function
function sendOrderToTelegram(orderDetails) {
    const botToken = '7851966567:AAGj_K70D5z3q8LgWv9nZ2xJ8m4P6s1Q2yE'; 
    const chatId = '6432109875';                                      
    
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
