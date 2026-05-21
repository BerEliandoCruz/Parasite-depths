// ============================================================
// Parasite Depths — Game Configuration & Constants
// ============================================================

const CONFIG = {
    // --- Display ---
    WIDTH: 960,
    HEIGHT: 540,

    // --- World Scrolling ---
    BASE_SCROLL_SPEED: 400,       // pixels/sec at start
    MAX_SCROLL_SPEED: 1500,       // higher hard cap for more challenge
    SCROLL_ACCELERATION: 12.0,    // pixels/sec speed increase per second

    // --- Parasite ---
    PARASITE: {
        VERTICAL_SPEED: 480,
        INERTIA_DAMPING: 0.88,    // velocity multiplied each frame (< 1 = drag)
        SIZE: 18,
        GLOW_RADIUS: 30,
        INVINCIBLE_AFTER_EJECT: 1500, // ms
    },

    // --- Host Types ---
    HOSTS: {
        SMALL: {
            name: 'Small Fish',
            speed_mult: 1.5,
            health: 40,
            attack: 1,
            energy: 8,           // seconds of possession
            size: 28,
            color: 0x44ddff,
        },
        MEDIUM: {
            name: 'Medium Fish',
            speed_mult: 1.35,
            health: 80,
            attack: 2,
            energy: 12,
            size: 42,
            color: 0x33bbaa,
        },
        PREDATOR: {
            name: 'Predator',
            speed_mult: 1.8,
            health: 150,
            attack: 4,
            energy: 6,
            size: 60,
            color: 0xff6644,
        },
    },

    // --- Sharks ---
    SHARKS: {
        SMALL: {
            name: 'Small Shark',
            speed: 260,
            health: 30,
            attack: 1,
            size: 36,
            points_dodge: 10,
            points_eat: 50,
            color: 0x556688,
        },
        MEDIUM: {
            name: 'Medium Shark',
            speed: 220,
            health: 70,
            attack: 3,
            size: 52,
            points_dodge: 20,
            points_eat: 100,
            color: 0x445577,
        },
        LARGE: {
            name: 'Large Shark',
            speed: 180,
            health: 140,
            attack: 5,
            size: 72,
            points_dodge: 40,
            points_eat: 200,
            color: 0x334466,
        },
    },

    // --- Spawning ---
    SPAWN: {
        SHARK_INTERVAL_START: 900,   // ms between sharks at start
        SHARK_INTERVAL_MIN: 250,     // fastest spawn rate
        SHARK_INTERVAL_DECAY: 0.992, // multiplier per spawn (faster decay)
        HOST_INTERVAL_START: 4000,
        HOST_INTERVAL_MIN: 2500,
        ITEM_INTERVAL_START: 9000,
        ITEM_INTERVAL_MIN: 5000,
        SAFE_MARGIN: 60,             // px from top/bottom
    },

    // --- Items ---
    ITEMS: {
        BIO_ENERGY: {
            name: 'Bio-Energy',
            color: 0x44ff88,
            effect: 'heal',
            value: 30,          // % energy restored
            points: 25,
        },
        RARE_PARASITE: {
            name: 'Rare Parasite',
            color: 0xffdd44,
            effect: 'multiplier',
            value: 2,           // multiplier amount
            duration: 10000,    // ms
            points: 50,
        },
        TURBO: {
            name: 'Ocean Turbo',
            color: 0x44aaff,
            effect: 'speed',
            value: 1.8,         // speed multiplier
            duration: 5000,
            points: 30,
        },
    },

    // --- Scoring ---
    SCORE: {
        DISTANCE_RATE: 1,       // points per unit distance
        DODGE_POINTS: 10,
        EAT_POINTS: 50,
        MULTIPLIER_BASE: 1,
        MULTIPLIER_MAX: 5,
        MULTIPLIER_GROWTH: 0.01, // per second survived
    },

    // --- Biomes ---
    BIOMES: [
        { name: 'Shallow Ocean',  distance: 0,     bgTop: 0x0a4a7a, bgBot: 0x062a4a, sharkMult: 1.0 },
        { name: 'Coral Reefs',    distance: 500,   bgTop: 0x0a6a5a, bgBot: 0x044a3a, sharkMult: 1.5 },
        { name: 'Open Sea',       distance: 1200,  bgTop: 0x082848, bgBot: 0x041828, sharkMult: 2.0 },
        { name: 'Deep Ocean',     distance: 2200,  bgTop: 0x041428, bgBot: 0x020a18, sharkMult: 2.6 },
        { name: 'Caverns',        distance: 3500,  bgTop: 0x0a0a1a, bgBot: 0x050510, sharkMult: 3.2 },
        { name: 'Volcanic Zone',  distance: 5000,  bgTop: 0x1a0808, bgBot: 0x0a0404, sharkMult: 3.8 },
        { name: 'Industrial',     distance: 7000,  bgTop: 0x0a0a0a, bgBot: 0x050508, sharkMult: 4.5 },
        { name: 'Coastal',        distance: 10000, bgTop: 0x1a3a2a, bgBot: 0x0a2a1a, sharkMult: 5.5 },
    ],

    // --- Colors ---
    COLORS: {
        PARASITE_GLOW: 0x00ffcc,
        PARASITE_BODY: 0x00ddaa,
        HUD_TEXT: '#00ffcc',
        HUD_SCORE: '#ffffff',
        HUD_BAR_BG: '#0a2a3a',
        HUD_BAR_FILL: '#00ffaa',
        HUD_BAR_LOW: '#ff4444',
        TITLE_GLOW: 0x00ffcc,
        MENU_BG: 0x040a14,
        DEATH_FLASH: 0xff2222,
    },

    // --- Skins ---
    SKINS: {
        PARASITE: [
            { id: 'classic', name: 'Classic Cyan', cost: 0, glow: 0x00ffcc, body: 0x00ddaa, core: 0x88ffee },
            { id: 'vampiric', name: 'Vampiric Crimson', cost: 50, glow: 0xff3333, body: 0xcc1111, core: 0xff8888 },
            { id: 'abyssal', name: 'Abyssal Gold', cost: 120, glow: 0xffaa00, body: 0xdd8800, core: 0xffddaa },
            { id: 'nebula', name: 'Nebula Purple', cost: 250, glow: 0xaa44ff, body: 0x8822dd, core: 0xeebbff },
            { id: 'toxic', name: 'Toxic Acid', cost: 400, glow: 0x39ff14, body: 0x22cc00, core: 0xccffaa },
            { id: 'shark', name: 'Apex Shark', cost: 600, glow: 0x88aacc, body: 0x556688, core: 0xccddee },
            { id: 'puffer', name: 'Spiky Puffer', cost: 850, glow: 0xffcc44, body: 0xdd8822, core: 0xffffaa },
        ],
        HOST: [
            { id: 'standard', name: 'Standard Biolum', cost: 0, colors: { SMALL: 0x44ddff, MEDIUM: 0x33bbaa, PREDATOR: 0xff6644 } },
            { id: 'neon', name: 'Neon Cyberpunk', cost: 80, colors: { SMALL: 0xff00ff, MEDIUM: 0x00ffff, PREDATOR: 0xff00aa } },
            { id: 'ghost', name: 'Ghostly Abyss', cost: 180, colors: { SMALL: 0xe0e8f0, MEDIUM: 0xc8d8e8, PREDATOR: 0xb0c8e0 } },
            { id: 'volcanic', name: 'Volcanic Magma', cost: 300, colors: { SMALL: 0xff5500, MEDIUM: 0xcc3300, PREDATOR: 0xaa2200 } },
        ]
    }
};
