// ============================================================
// Parasite Depths — Game Configuration & Constants
// ============================================================

const CONFIG = {
    // --- Display ---
    WIDTH: 960,
    HEIGHT: 540,

    // --- World Scrolling ---
    BASE_SCROLL_SPEED: 120,       // pixels/sec at start
    MAX_SCROLL_SPEED: 400,        // hard cap
    SCROLL_ACCELERATION: 0.15,    // speed increase per second

    // --- Parasite ---
    PARASITE: {
        VERTICAL_SPEED: 220,
        INERTIA_DAMPING: 0.88,    // velocity multiplied each frame (< 1 = drag)
        SIZE: 18,
        GLOW_RADIUS: 30,
        INVINCIBLE_AFTER_EJECT: 1500, // ms
    },

    // --- Host Types ---
    HOSTS: {
        SMALL: {
            name: 'Small Fish',
            speed_mult: 1.3,
            health: 40,
            attack: 1,
            energy: 8,           // seconds of possession
            size: 28,
            color: 0x44ddff,
        },
        MEDIUM: {
            name: 'Medium Fish',
            speed_mult: 1.15,
            health: 80,
            attack: 2,
            energy: 12,
            size: 42,
            color: 0x33bbaa,
        },
        PREDATOR: {
            name: 'Predator',
            speed_mult: 1.5,
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
            speed: 180,
            health: 30,
            attack: 1,
            size: 36,
            points_dodge: 10,
            points_eat: 50,
            color: 0x556688,
        },
        MEDIUM: {
            name: 'Medium Shark',
            speed: 150,
            health: 70,
            attack: 3,
            size: 52,
            points_dodge: 20,
            points_eat: 100,
            color: 0x445577,
        },
        LARGE: {
            name: 'Large Shark',
            speed: 120,
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
        SHARK_INTERVAL_START: 2200,  // ms between sharks at start
        SHARK_INTERVAL_MIN: 500,     // fastest spawn rate
        SHARK_INTERVAL_DECAY: 0.997, // multiplier per spawn
        HOST_INTERVAL_START: 5000,
        HOST_INTERVAL_MIN: 3000,
        ITEM_INTERVAL_START: 12000,
        ITEM_INTERVAL_MIN: 7000,
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
        { name: 'Coral Reefs',    distance: 500,   bgTop: 0x0a6a5a, bgBot: 0x044a3a, sharkMult: 1.2 },
        { name: 'Open Sea',       distance: 1200,  bgTop: 0x082848, bgBot: 0x041828, sharkMult: 1.4 },
        { name: 'Deep Ocean',     distance: 2200,  bgTop: 0x041428, bgBot: 0x020a18, sharkMult: 1.7 },
        { name: 'Caverns',        distance: 3500,  bgTop: 0x0a0a1a, bgBot: 0x050510, sharkMult: 2.0 },
        { name: 'Volcanic Zone',  distance: 5000,  bgTop: 0x1a0808, bgBot: 0x0a0404, sharkMult: 2.3 },
        { name: 'Industrial',     distance: 7000,  bgTop: 0x0a0a0a, bgBot: 0x050508, sharkMult: 2.6 },
        { name: 'Coastal',        distance: 10000, bgTop: 0x1a3a2a, bgBot: 0x0a2a1a, sharkMult: 3.0 },
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
};
