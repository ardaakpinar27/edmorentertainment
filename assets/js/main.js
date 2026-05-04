/**
 * EDMOR GAMEPASS - ULTIMATE STABLE
 */

const games = [
    { 
        id: 1, 
        title: "TEKKEN 3", 
        cover: "https://images.alphacoders.com/270/270636.jpg", 
        rom: "https://filedn.eu/liPnBWWQgeQVeGgdPoPnl8S/ps1roms/tekken3.chd" 
    }
];

let focusIndex = 0;
let isPlaying = false;
let canMove = true;

window.onload = () => {
    renderGames();
    startClock();
    updateLoop();
    
    // Geri tuşu kontrolü
    window.addEventListener('popstate', handleBackToMenu);
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" || e.key === "Backspace") handleBackToMenu();
    });
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

function handleBackToMenu() {
    if (isPlaying) {
        // Sayfayı yenilemek en temiz yöntemdir (Belleği boşaltır ve sesi durdurur)
        window.location.reload(); 
    }
}

function updateLoop() {
    const gps = navigator.getGamepads();
    const gp = gps[0];
    
    if (!gp) { 
        updateStatus(false); 
        requestAnimationFrame(updateLoop); 
        return; 
    }
    
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

function debounceInput() { 
    canMove = false; 
    setTimeout(() => { canMove = true; }, 180); 
}

function handleStartGame() {
    const selectedGame = games[focusIndex];
    isPlaying = true;
    
    document.getElementById('launcher-ui').classList.add('hidden');
    document.getElementById('emulator-layer').style.display = 'block';

    const repoPath = window.location.pathname.includes('edmorentertainment') ? '/edmorentertainment/' : '/';
    const baseUrl = window.location.origin + repoPath;

    window.EJS_player = "#canvas-wrapper";
    window.EJS_core = "psx"; 
    window.EJS_gameUrl = selectedGame.rom; 
    window.EJS_biosUrl = baseUrl + "data/bios/scph1001.bin";
    window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    
    window.EJS_startOnLoaded = true;
    window.EJS_aspectRatio = "16/9"; 
    window.EJS_widescreenHack = true; 
    window.EJS_video_filter = "nearest";
    
    // --- SES VE KOL OPTİMİZASYONU ---
    window.EJS_threads = true;
    window.EJS_forceVSync = true;
    
    window.EJS_settings = {
        "psx_gpu_upscale": "2x", // Görüntü kalitesi korunuyor
        "audio_buffer": 4096,    // Ses kesilmesini önlemek için tampon yükseltildi
        "audio_driver": "webaudio"
    };

    // Oyun başlayınca kolu ve odağı emülatöre bağla
    window.EJS_onGameStart = () => {
        console.log("Oyun başladı, odaklanılıyor...");
        const canvas = document.querySelector('canvas');
        if (canvas) canvas.focus();
    };

    const script = document.createElement("script");
    script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    document.head.appendChild(script);
}

function updateStatus(connected, name = "") {
    const status = document.getElementById('gamepad-status');
    if (status) {
        status.className = connected ? "connected" : "disconnected";
        status.innerText = connected ? "● " + name.substring(0, 15).toUpperCase() : "● DISCONNECTED";
    }
}

function startClock() {
    setInterval(() => {
        const clock = document.getElementById('clock');
        if (clock) clock.innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }, 1000);
}
