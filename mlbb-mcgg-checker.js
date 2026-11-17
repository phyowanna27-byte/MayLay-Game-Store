// mlbb-mcgg-checker.js — MLBB & MCGG Auto-Checker (Requires UID + Zone/Server)

let globalRegionCode = "N/A";
let globalNickname = "";
let checkTimer = null;

function checkPlayerName() {
    clearTimeout(checkTimer);
    checkTimer = setTimeout(runPlayerCheck, 500);
}

function extractNicknameAndRegion(payloadData) {
    if (!payloadData || typeof payloadData !== 'object') {
        return { nickname: "", region: "N/A", valid: false };
    }

    const dataObj = payloadData.data && typeof payloadData.data === 'object' ? payloadData.data : null;
    if (dataObj) {
        if (dataObj.valid === false || dataObj.nickname === null || dataObj.nickname === undefined) {
            return { nickname: "", region: dataObj.region_code || "N/A", valid: false };
        }
        const nick = String(dataObj.nickname || "").trim();
        const reg = String(dataObj.region_code || dataObj.region || "N/A").trim();
        if (nick) {
            return { nickname: nick, region: reg || "N/A", valid: true };
        }
    }

    const candidates = [payloadData, payloadData.result, payloadData.player, payloadData.info].filter(Boolean);
    let nickname = "";
    let region = "N/A";

    for (const obj of candidates) {
        if (!nickname) {
            nickname = obj.nickname || obj.nick_name || obj.username || obj.user_name || obj.PlayerName || obj.player_name || obj.name || obj.ign || "";
        }
        if (region === "N/A") {
            region = obj.region_code || obj.region || obj.country || obj.zone || obj.server || "N/A";
        }
    }

    const cleanNick = String(nickname || "").trim();
    return { nickname: cleanNick, region: String(region || "N/A").trim(), valid: Boolean(cleanNick) };
}

async function checkMlbbMcgg(game, uid, server, nameInput, statusEl) {
    if (!server) {
        statusEl.innerHTML = `<span class="text-red-500 font-bold">⚠️ Server / Zone ID ထည့်ရန် လိုအပ်ပါသည်။</span>`;
        return;
    }

    statusEl.innerHTML = `🔍 ${game.toUpperCase()} In-game Name စစ်ဆေးနေပါပြီ...`;

    const publicEndpoints = [
        `https://api.isan.eu.org/nickname/ml?id=${encodeURIComponent(uid)}&zone=${encodeURIComponent(server)}`,
        `https://mlbb-stats.ridwaanhall.com/api/player/?id=${encodeURIComponent(uid)}&zone=${encodeURIComponent(server)}`
    ];

    for (const url of publicEndpoints) {
        try {
            const res = await fetch(url);
            if (!res.ok) continue;
            const data = await res.json();
            const extracted = extractNicknameAndRegion(data);
            if (extracted.nickname) {
                globalNickname = extracted.nickname;
                globalRegionCode = extracted.region;
                nameInput.value = globalNickname;
                statusEl.innerHTML = `<span class="text-emerald-600 font-bold">✅ Account Found (${globalNickname}) | Region: ${globalRegionCode}</span>`;
                return;
            }
        } catch (e) {}
    }

    try {
        const response = await fetch(`https://game-id-checker-api.p.rapidapi.com/check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-rapidapi-host': 'game-id-checker-api.p.rapidapi.com',
                'x-rapidapi-key': '65d116a2ddmshe0c1954f29997f0p11513cjsne76cf19b7b29'
            },
            body: JSON.stringify({ game: String(game), player_id: String(uid), zone_id: String(server) })
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
    } catch (e) {}

    statusEl.innerHTML = `<span class="text-amber-600 font-semibold">⚠️ အလိုအလျောက် မပေါ်ပါ — အပေါ် Box မှာ နာမည်ရိုက်ထည့်ပြီး Order တင်နိုင်ပါသည်။</span>`;
}

async function runPlayerCheck() {
    const gameSelectEl = document.getElementById('game-select');
    const uidEl = document.getElementById('f-uid');
    const serverEl = document.getElementById('f-server');
    const nameInput = document.getElementById('f-ingame-name-input');
    const statusEl = document.getElementById('f-ingame-status');

    if (!gameSelectEl || !uidEl || !nameInput || !statusEl) return;

    const game = gameSelectEl.value;
    const uid = uidEl.value.replace(/[^0-9]/g, '').trim();
    const server = serverEl ? serverEl.value.replace(/[^0-9]/g, '').trim() : "";

    if (uidEl.value !== uid) uidEl.value = uid;
    if (serverEl && serverEl.value !== server) serverEl.value = server;

    globalRegionCode = "N/A";

    if (!uid) {
        statusEl.innerHTML = `🔍 Game UID ထည့်ပြီး အလိုအလျောက် စစ်ဆေးပါမည်...`;
        return;
    }

    if (game === 'mlbb' || game === 'mcgg') {
        await checkMlbbMcgg(game, uid, server, nameInput, statusEl);
    } else if (game === 'pubgm' || game === 'hok') {
        if (typeof checkPubgHok === 'function') {
            await checkPubgHok(game, uid, nameInput, statusEl);
        }
    }
}

