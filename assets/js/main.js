/**
 * EDMOR GAMEPASS - DEBUGGED VERSION
 */

const games = [
    { 
        id: 1, 
        title: "TEKKEN 3", 
        cover: "https://www.giantbomb.com/a/uploads/scale_medium/0/4387/537025-tekken3_ps1_boxart.jpg", 
        rom: "https://filedn.eu/liPnBWWQgeQVeGgdPoPnl8S/ps1roms/tekken3.chd" 
    },
    { 
        id: 2, 
        title: "CRASH BANDICOOT", 
        cover: "https://www.giantbomb.com/a/uploads/scale_medium/0/176/2324905-crash_bandicoot_box_art.jpg", 
        rom: "https://filedn.eu/liPnBWWQgeQVeGgdPoPnl8S/ps1roms/crashbandicoot.chd" 
    }
];

let focusIndex = 0;
let isPlaying = false;
let canMove = true;

window.onload = () => {
    renderGames();
    startClock();
    updateLoop();
    
    document.addEventListener('keydown', (e) => {
        if (isPlaying && (e.key === "Escape" || e.key === "Backspace")) {
            window.location.reload();
        }
    });
};

function renderGames() {
    const grid = document.getElementById('game-grid');
    if (!grid) return;
    grid.innerHTML = games.map((game, index) => `
        <div class="game-card ${index === 0 ? 'focused' : ''}" data-index="${index}">
            <img src="${game.cover}" alt="${game.title}">
            <div class="game-info">${game.title}</div>
        </div>
    `).join('');
}

function handleStartGame() {
    const selectedGame = games[focusIndex];
    isPlaying = true;
    
    document.getElementById('launcher-ui').classList.add('hidden');
    document.getElementById('emulator-layer').style.display = 'block';

    // Yerel sunucu (localhost) veya GitHub Pages tespiti
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const repoPath = window.location.pathname.includes('edmorentertainment') ? '/edmorentertainment/' : '/';
    const baseUrl = window.location.origin + (isLocal ? '/' : repoPath);

    // Motor Ayarları
    window.EJS_player = "#canvas-wrapper";
    window.EJS_core = "psx"; 
    window.EJS_gameUrl = selectedGame.rom; 
    
    // BIOS Yolunu Doğrula (scph1001.bin dosyasının bu yolda olduğundan emin ol)
    window.EJS_biosUrl = baseUrl + "data/bios/scph1001.bin";
    
    window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    window.EJS_startOnLoaded = true;
    window.EJS_showControls = false; // Temiz ePSXe hissi

    window.EJS_settings = {
        "psx_gpu_upscale": "2x",
        "audio_buffer": 4096,
        "audio_driver": "webaudio"
    };

    const script = document.createElement("script");
    script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    document.head.appendChild(script);
}

// Konsol (F12) hatalarını takip etmek için status ve clock fonksiyonlarını koru...
function updateLoop() {
    const gps = navigator.getGamepads();
    const gp = gps[0];
    if (!gp) { updateStatus(false); requestAnimationFrame(updateLoop); return; }
    updateStatus(true, gp.id);
    if (!isPlaying && canMove) {
        const right = gp.axes[0] > 0.5 || gp.buttons[15]?.pressed;
        const left = gp.axes[0] < -0.5 || gp.buttons[14]?.pressed;
        if (right) { moveFocus(1); debounceInput(); }
        else if (left) { moveFocus(-1); debounceInput(); }
        if (gp.buttons[0].pressed) { handleStartGame(); }
    }
    requestAnimationFrame(updateLoop);
}

function moveFocus(dir) {
    const cards = document.querySelectorAll('.game-card');
    if (cards.length === 0) return;
    cards[focusIndex].classList.remove('focused');
    focusIndex = (focusIndex + dir + cards.length) % cards.length;
    cards[focusIndex].classList.add('focused');
}

function debounceInput() { canMove = false; setTimeout(() => { canMove = true; }, 180); }

function updateStatus(connected, name = "") {
    const status = document.getElementById('gamepad-status');
    if (status) {
        status.className = connected ? "connected" : "disconnected";
        status.innerText = connected ? "● CONTROLLER: " + name.substring(0, 15).toUpperCase() : "● CONTROLLER NOT FOUND";
    }
}

function startClock() {
    setInterval(() => {
        const clock = document.getElementById('clock');
        if (clock) clock.innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }, 1000);
}
