/**
 * EDMOR GAMEPASS - CORE FIX
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

// ... (focus ve updateLoop kısımları aynı kalsın)

function handleStartGame() {
    const selectedGame = games[focusIndex];
    isPlaying = true;
    
    document.getElementById('launcher-ui').classList.add('hidden');
    document.getElementById('emulator-layer').style.display = 'block';

    window.EJS_player = "#canvas-wrapper";
    window.EJS_core = "psx"; // Core ismi net olmalı
    window.EJS_gameUrl = selectedGame.rom; 
    
    // Yolu doğrudan ve kesin verelim
    window.EJS_biosUrl = "data/bios/scph1001.bin";
    
    // Core dosyalarının çekileceği yer (Kritik: stable yerine bazen doğrudan sürüm gerekebilir)
    window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    
    window.EJS_startOnLoaded = true;
    window.EJS_showControls = false; 

    // 5501 hatasını engellemek için ek ayar:
    window.EJS_language = "en-US";
    window.EJS_threads = true;

    window.EJS_settings = {
        "psx_gpu_upscale": "2x",
        "audio_buffer": 4096,
        "audio_driver": "webaudio"
    };

    const script = document.createElement("script");
    script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    document.head.appendChild(script);
}
