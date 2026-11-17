// pubg-hok-checker.js — PUBG Mobile & HOK Auto-Checker (UID only, no zone_id)

async function checkPubgHok(game, uid, nameInput, statusEl) {
    statusEl.innerHTML = `🔍 ${game.toUpperCase()} In-game Name စစ်ဆေးနေပါပြီ...`;

    try {
        const response = await fetch(`https://game-id-checker-api.p.rapidapi.com/check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-rapidapi-host': 'game-id-checker-api.p.rapidapi.com',
                'x-rapidapi-key': '65d116a2ddmshe0c1954f29997f0p11513cjsne76cf19b7b29'
            },
            body: JSON.stringify({ game: String(game), player_id: String(uid) })
        });
        const data = await response.json().catch(() => ({}));
        const extracted = extractNicknameAndRegion(data);
        if (extracted.nickname) {
            globalNickname = extracted.nickname;
            globalRegionCode = extracted.region;
            nameInput.value = globalNickname;
            statusEl.innerHTML = `<span class="text-emerald-600 font-bold">✅ Account Found (${globalNickname}) | Region: ${globalRegionCode}</span>`;
            return;
        }
        statusEl.innerHTML = `<span class="text-amber-600 font-semibold">⚠️ API Status ${response.status} (${data?.data?.valid === false ? 'Invalid UID' : 'No Nickname'}) — အပေါ် Box မှာ နာမည်ရိုက်ထည့်ပြီး Order တင်နိုင်ပါသည်။</span>`;
    } catch (error) {
        statusEl.innerHTML = `<span class="text-amber-600 font-semibold">⚠️ Browser CORS/Network Block — အပေါ် Box မှာ နာမည်ရိုက်ထည့်ပြီး Order တင်နိုင်ပါသည်။</span>`;
    }
}

