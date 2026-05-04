/**
 * EDMOR GAMEPASS - GITHUB PAGES PROXY EDITION
 * Bu dosya CORS (Network Error) hatalarını aşmak için yapılandırılmıştır.
 */

const games = [
    { 
        id: 1, 
        title: "TEKKEN 3", 
        cover: "https://images.alphacoders.com/270/270636.jpg", 
        // CORS Proxy eklenmiş link:
        rom: "https://corsproxy.io/?https://filedn.eu/liPnBWWQgeQVeGgdPoPnl8S/ps1roms/tekken3.chd" 
    }
];

let focusIndex = 0;
let isPlaying = false;
let canMove = true;

window.onload = () => {
    renderGames();
    startClock();
    updateLoop();
};

function renderGames() {
    const grid = document.getElementById('game-grid');
    if (!grid) return;
    grid.innerHTML = games.map((game, index) => `
        <div class="game-card ${index === 0 ? 'focused' : ''}" data-index="${index}">
            <img src="${game.cover}">
            <div class="game-info">${game.title}</div>
        </div>
    `).join('');
}

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
    cards[focusIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function debounceInput() { canMove = false; setTimeout(() => { canMove = true; }, 180); }

function handleStartGame() {
    const selectedGame = games[focusIndex];
    if (!selectedGame.rom.startsWith("http")) return;

    isPlaying = true;
    document.getElementById('launcher-ui').classList.add('hidden');
    document.getElementById('emulator-layer').style.display = 'block';

    // GitHub Pages alt klasör yapısını (edmorentertainment) yakalar
    const pathArray = window.location.pathname.split('/');
    const repoName = pathArray[1]; 
    const baseUrl = window.location.origin + '/' + repoName + '/';

    window.EJS_player = "#canvas-wrapper";
    window.EJS_core = "psx"; 
    window.EJS_gameUrl = selectedGame.rom; 
    
    // BIOS Dosya Yolu
    window.EJS_biosUrl = baseUrl + "data/bios/scph1001.bin";
    
    // Emülatör Motoru Dosyaları
    window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    
    // Görüntü ve Geniş Ekran Ayarları
    window.EJS_startOnLoaded = true;
    window.EJS_aspectRatio = "16/9"; 
    window.EJS_widescreenHack = true; 
    window.EJS_video_filter = "nearest"; 
    window.EJS_softfilter = false;

    window.EJS_settings = {
        "psx_gpu_upscale": "2x",
        "psx_gpu_precision": "high"
    };

    const script = document.createElement("script");
    script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    document.head.appendChild(script);
}

function updateStatus(connected, name = "") {
    const status = document.getElementById('gamepad-status');
    if (connected) {
        status.className = "connected";
        status.innerText = "● " + name.substring(0, 15).toUpperCase();
    } else {
        status.className = "disconnected";
        status.innerText = "● DISCONNECTED";
    }
}

function startClock() {
    setInterval(() => {
        document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }, 1000);
}
