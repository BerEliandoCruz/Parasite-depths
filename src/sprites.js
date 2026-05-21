// ============================================================
// Parasite Depths — Procedural Sprite Generation
// ============================================================

class SpriteGenerator {
    constructor(scene) {
        this.scene = scene;
    }

    generateAll() {
        CONFIG.SKINS.PARASITE.forEach(skin => {
            this.generateParasite(skin);
            this.generateParasiteGlow(skin);
        });
        CONFIG.SKINS.HOST.forEach(skin => {
            this.generateHosts(skin);
        });
        this.generateSharks();
        this.generateItems();
        this.generateBackgroundElements();
        this.generateParticles();
    }

    generateParasite(skin) {
        const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
        const s = 18;

        if (skin.id === 'shark') {
            const w = s * 1.8, h = s * 1.0;
            const cx = w/2 + 10, cy = h/2 + 10;
            // Body
            g.fillStyle(skin.body, 1);
            g.fillEllipse(cx, cy, w, h);
            // Snout
            g.fillTriangle(cx + w/2, cy, cx + w/2 + 12, cy + 2, cx + w/2, cy + h * 0.3);
            // Dorsal fin
            g.fillTriangle(cx - 5, cy - h/2, cx, cy - h/2 - 12, cx + 12, cy - h/2);
            // Tail
            g.fillTriangle(cx - w/2, cy, cx - w/2 - 14, cy - h * 0.5, cx - w/2 - 14, cy + h * 0.5);
            // Pectoral fin
            g.fillStyle(skin.body, 0.9);
            g.fillTriangle(cx - 2, cy + h * 0.2, cx + 4, cy + h * 0.2 + 8, cx + 10, cy + h * 0.2);

            // Inner glow (Parasite core)
            g.fillStyle(skin.glow, 0.7);
            g.fillEllipse(cx, cy, w * 0.5, h * 0.5);
            // Core bright spot
            g.fillStyle(skin.core, 0.9);
            g.fillEllipse(cx - 2, cy - 2, w * 0.25, h * 0.25);
            // Eye
            g.fillStyle(0xffffff, 0.9);
            g.fillCircle(cx + w * 0.25, cy - h * 0.15, 3);
            g.fillStyle(0x000000, 1);
            g.fillCircle(cx + w * 0.27, cy - h * 0.15, 1.5);

            g.generateTexture('parasite_' + skin.id, w + 30, h + 30);
        } else if (skin.id === 'puffer') {
            const w = s * 2.2, h = s * 2.2;
            const cx = w/2 + 10, cy = h/2 + 10;
            
            // Spikes (drawn before body so they stick out)
            g.fillStyle(skin.body, 1);
            for(let i=0; i<12; i++) {
                const angle = (i / 12) * Math.PI * 2;
                const innerR = s * 0.9;
                const outerR = s * 1.5;
                const x1 = cx + Math.cos(angle - 0.15) * innerR;
                const y1 = cy + Math.sin(angle - 0.15) * innerR;
                const x2 = cx + Math.cos(angle + 0.15) * innerR;
                const y2 = cy + Math.sin(angle + 0.15) * innerR;
                const px = cx + Math.cos(angle) * outerR;
                const py = cy + Math.sin(angle) * outerR;
                g.fillTriangle(x1, y1, px, py, x2, y2);
            }
            
            // Round body
            g.fillCircle(cx, cy, s * 1.1);

            // Inner glow (Parasite core)
            g.fillStyle(skin.glow, 0.7);
            g.fillCircle(cx, cy, s * 0.7);
            
            // Core bright spot
            g.fillStyle(skin.core, 0.9);
            g.fillCircle(cx - 2, cy - 2, s * 0.3);
            
            // Eyes
            g.fillStyle(0xffffff, 0.9);
            g.fillCircle(cx + s * 0.4, cy - s * 0.3, 3);
            g.fillCircle(cx + s * 0.7, cy - s * 0.3, 3);
            g.fillStyle(0x000000, 1);
            g.fillCircle(cx + s * 0.45, cy - s * 0.3, 1.5);
            g.fillCircle(cx + s * 0.75, cy - s * 0.3, 1.5);

            g.generateTexture('parasite_' + skin.id, w + 20, h + 20);
        } else {
            // Body - bioluminescent blob
            g.fillStyle(skin.body, 1);
            g.fillEllipse(s, s, s * 1.6, s * 1.2);
            // Inner glow
            g.fillStyle(skin.glow, 0.6);
            g.fillEllipse(s, s, s * 0.9, s * 0.7);
            // Core bright spot
            g.fillStyle(skin.core, 0.8);
            g.fillEllipse(s - 2, s - 2, s * 0.4, s * 0.3);
            // Eye
            g.fillStyle(0xffffff, 0.9);
            g.fillCircle(s + 4, s - 3, 3);
            g.fillStyle(0x000000, 1);
            g.fillCircle(s + 5, s - 3, 1.5);
            // Tentacles
            g.lineStyle(2, skin.body, 0.7);
            g.beginPath();
            g.moveTo(s - 10, s + 2);
            g.lineTo(s - 16, s + 6);
            g.moveTo(s - 10, s + 5);
            g.lineTo(s - 17, s + 10);
            g.moveTo(s - 8, s + 7);
            g.lineTo(s - 14, s + 13);
            g.strokePath();
            g.generateTexture('parasite_' + skin.id, s * 2, s * 2);
        }
        g.destroy();
    }

    generateParasiteGlow(skin) {
        const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
        const r = 30;
        g.fillStyle(skin.glow, 0.15);
        g.fillCircle(r, r, r);
        g.fillStyle(skin.glow, 0.08);
        g.fillCircle(r, r, r * 0.6);
        g.generateTexture('parasite_glow_' + skin.id, r * 2, r * 2);
        g.destroy();
    }

    generateHosts(skin) {
        this._generateFish('host_small_' + skin.id, 28, skin.colors.SMALL, false, skin.id);
        this._generateFish('host_small_p_' + skin.id, 28, skin.colors.SMALL, true, skin.id);
        this._generateFish('host_medium_' + skin.id, 42, skin.colors.MEDIUM, false, skin.id);
        this._generateFish('host_medium_p_' + skin.id, 42, skin.colors.MEDIUM, true, skin.id);
        this._generatePredator('host_predator_' + skin.id, 60, skin.colors.PREDATOR, false, skin.id);
        this._generatePredator('host_predator_p_' + skin.id, 60, skin.colors.PREDATOR, true, skin.id);
    }

    _generateFish(key, size, color, possessed, skinId) {
        const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
        const w = size * 2, h = size * 1.2;
        const cx = w / 2 + 10, cy = h / 2 + 10;
        
        if (skinId === 'neon') {
            g.fillStyle(color, 1);
            g.fillRect(cx - w/2, cy - h/2, w, h);
            g.fillStyle(0x000000, 0.3);
            g.fillRect(cx - w/2, cy, w, h/2);
            g.fillStyle(color, 0.8);
            g.fillTriangle(cx - w/2, cy, cx - w/2 - 20, cy - h/2, cx - w/2 - 20, cy + h/2);
            g.fillStyle(0xffffff, 0.9);
            g.fillRect(cx + w * 0.2, cy - h * 0.2, size * 0.15, size * 0.15);
            g.fillStyle(color, 1);
            g.fillRect(cx + w * 0.22, cy - h * 0.18, size * 0.08, size * 0.08);
            g.fillStyle(color, 0.6);
            g.fillRect(cx - 5, cy - h/2 - 10, 15, 10);
        } else if (skinId === 'ghost') {
            g.fillStyle(color, 0.5);
            g.fillEllipse(cx, cy, w * 1.2, h * 0.6);
            g.fillStyle(color, 0.3);
            g.fillEllipse(cx - w/2 - 10, cy, w * 0.6, h * 0.3);
            g.fillStyle(0xffffff, 0.8);
            g.fillCircle(cx + w * 0.3, cy - h * 0.05, size * 0.1);
        } else if (skinId === 'volcanic') {
            g.fillStyle(color, 1);
            g.fillEllipse(cx, cy, w, h);
            g.lineStyle(2, 0xffaa00, 0.8);
            g.beginPath(); g.moveTo(cx - 10, cy); g.lineTo(cx, cy + 10); g.lineTo(cx + 10, cy); g.strokePath();
            g.fillStyle(0x331100, 0.9);
            for(let i=0; i<3; i++) g.fillTriangle(cx - 10 + i*10, cy - h/2 + 5, cx - 5 + i*10, cy - h/2 - 10, cx + i*10, cy - h/2 + 5);
            g.fillStyle(color, 0.8);
            g.fillTriangle(cx - w/2 - 5, cy, cx - w/2 - 18, cy - h * 0.3, cx - w/2 - 18, cy + h * 0.3);
            g.fillStyle(0xffaa00, 0.9);
            g.fillCircle(cx + w * 0.25, cy - h * 0.1, size * 0.12);
            g.fillStyle(0x000000, 1);
            g.fillCircle(cx + w * 0.27, cy - h * 0.1, size * 0.06);
        } else {
            g.fillStyle(color, 1);
            g.fillEllipse(cx, cy, w, h);
            g.fillStyle(0xffffff, 0.15);
            g.fillEllipse(cx, cy + h * 0.15, w * 0.7, h * 0.4);
            g.fillStyle(color, 0.8);
            g.fillTriangle(cx - w/2 - 5, cy, cx - w/2 - 18, cy - h * 0.4, cx - w/2 - 18, cy + h * 0.4);
            g.fillStyle(0xffffff, 0.9);
            g.fillCircle(cx + w * 0.25, cy - h * 0.1, size * 0.12);
            g.fillStyle(0x000000, 1);
            g.fillCircle(cx + w * 0.27, cy - h * 0.1, size * 0.06);
            g.fillStyle(color, 0.6);
            g.fillTriangle(cx - 5, cy - h/2, cx + 10, cy - h/2 - 10, cx + 15, cy - h/2 + 5);
        }
        
        if (possessed) {
            g.lineStyle(2, 0x00ffcc, 0.8);
            g.strokeEllipse(cx, cy, w + 6, h + 6);
            g.fillStyle(0x00ffcc, 0.1);
            g.fillEllipse(cx, cy, w + 12, h + 12);
        }
        g.generateTexture(key, w + 30, h + 30);
        g.destroy();
    }

    _generatePredator(key, size, color, possessed, skinId) {
        const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
        const w = size * 2.2, h = size * 1.0;
        const cx = w / 2 + 15, cy = h / 2 + 15;
        
        if (skinId === 'neon') {
            g.fillStyle(color, 1);
            g.fillRect(cx - w/2, cy - h/2, w, h);
            g.fillStyle(color, 0.9);
            g.fillTriangle(cx + w/2, cy, cx + w/2 + 20, cy - 5, cx + w/2 + 20, cy + 15);
            g.fillStyle(0xffffff, 0.9);
            for (let i = 0; i < 4; i++) g.fillRect(cx + w/2 + 2 + i*4, cy + 2, 2, 6);
            g.fillStyle(0xffffff, 0.9);
            g.fillRect(cx + w * 0.2, cy - h * 0.2, size * 0.15, size * 0.15);
            g.fillStyle(0xff0000, 1);
            g.fillRect(cx + w * 0.22, cy - h * 0.18, size * 0.08, size * 0.08);
            g.fillStyle(color, 0.7);
            g.fillRect(cx - 10, cy - h/2 - 15, 25, 15);
            g.fillStyle(color, 0.8);
            g.fillTriangle(cx - w/2, cy, cx - w/2 - 25, cy - h/2, cx - w/2 - 25, cy + h/2);
        } else if (skinId === 'ghost') {
            g.fillStyle(color, 0.5);
            g.fillEllipse(cx, cy, w * 1.1, h * 0.8);
            g.fillStyle(color, 0.4);
            g.fillTriangle(cx + w/2, cy, cx + w/2 + 15, cy - 5, cx + w/2 + 15, cy + 8);
            g.fillStyle(0xffffff, 0.5);
            for (let i = 0; i < 4; i++) g.fillTriangle(cx + w/2 + 2 + i*3, cy + 2, cx + w/2 + 3 + i*3, cy + 6, cx + w/2 + 4 + i*3, cy + 2);
            g.fillStyle(0xffffff, 0.8);
            g.fillCircle(cx + w * 0.2, cy - h * 0.15, size * 0.12);
            g.fillStyle(color, 0.3);
            g.fillEllipse(cx - w/2 - 15, cy, w * 0.5, h * 0.4);
        } else if (skinId === 'volcanic') {
            g.fillStyle(color, 1);
            g.fillEllipse(cx, cy, w, h);
            g.fillStyle(color, 0.9);
            g.fillTriangle(cx + w/2, cy, cx + w/2 + 15, cy - 5, cx + w/2 + 15, cy + 8);
            g.fillStyle(0xffaa00, 0.9);
            for (let i = 0; i < 4; i++) g.fillTriangle(cx + w/2 + 2 + i*3, cy + 2, cx + w/2 + 3 + i*3, cy + 6, cx + w/2 + 4 + i*3, cy + 2);
            g.lineStyle(3, 0xffaa00, 0.8);
            g.beginPath(); g.moveTo(cx - 15, cy); g.lineTo(cx + 5, cy + 15); g.lineTo(cx + 20, cy + 5); g.strokePath();
            g.fillStyle(0xffaa00, 0.9);
            g.fillCircle(cx + w * 0.2, cy - h * 0.15, size * 0.1);
            g.fillStyle(0x000000, 1);
            g.fillCircle(cx + w * 0.22, cy - h * 0.15, size * 0.05);
            g.fillStyle(0x331100, 0.9);
            for(let i=0; i<4; i++) g.fillTriangle(cx - 15 + i*10, cy - h/2 + 5, cx - 10 + i*10, cy - h/2 - 15, cx - 5 + i*10, cy - h/2 + 5);
            g.fillStyle(color, 0.8);
            g.fillTriangle(cx - w/2 - 5, cy, cx - w/2 - 22, cy - h * 0.5, cx - w/2 - 22, cy + h * 0.5);
        } else {
            g.fillStyle(color, 1);
            g.fillEllipse(cx, cy, w, h);
            g.fillStyle(color, 0.9);
            g.fillTriangle(cx + w/2, cy, cx + w/2 + 15, cy - 5, cx + w/2 + 15, cy + 8);
            g.fillStyle(0xffffff, 0.9);
            for (let i = 0; i < 4; i++) g.fillTriangle(cx + w/2 + 2 + i*3, cy + 2, cx + w/2 + 3 + i*3, cy + 6, cx + w/2 + 4 + i*3, cy + 2);
            g.fillStyle(0xff4444, 0.9);
            g.fillCircle(cx + w * 0.2, cy - h * 0.15, size * 0.1);
            g.fillStyle(0x000000, 1);
            g.fillCircle(cx + w * 0.22, cy - h * 0.15, size * 0.05);
            g.fillStyle(color, 0.7);
            g.fillTriangle(cx - 10, cy - h/2, cx + 5, cy - h/2 - 18, cx + 20, cy - h/2);
            g.fillStyle(color, 0.8);
            g.fillTriangle(cx - w/2 - 5, cy, cx - w/2 - 22, cy - h * 0.5, cx - w/2 - 22, cy + h * 0.5);
        }
        
        if (possessed) {
            g.lineStyle(3, 0x00ffcc, 0.8);
            g.strokeEllipse(cx, cy, w + 10, h + 10);
            g.fillStyle(0x00ffcc, 0.08);
            g.fillEllipse(cx, cy, w + 20, h + 20);
        }
        g.generateTexture(key, w + 40, h + 40);
        g.destroy();
    }

    generateSharks() {
        this._generateShark('shark_small', CONFIG.SHARKS.SMALL);
        this._generateShark('shark_medium', CONFIG.SHARKS.MEDIUM);
        this._generateShark('shark_large', CONFIG.SHARKS.LARGE);
    }

    _generateShark(key, cfg) {
        const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
        const s = cfg.size;
        const w = s * 2.4, h = s * 1.0;
        const cx = w / 2 + 10, cy = h / 2 + 15;
        // Body
        g.fillStyle(cfg.color, 1);
        g.fillEllipse(cx, cy, w, h);
        // Snout
        g.fillStyle(cfg.color, 0.95);
        g.fillTriangle(cx + w/2, cy, cx + w/2 + 20, cy + 2, cx + w/2, cy + h * 0.3);
        // Belly (lighter)
        g.fillStyle(0x8899aa, 0.3);
        g.fillEllipse(cx, cy + h * 0.15, w * 0.7, h * 0.35);
        // Dorsal fin
        g.fillStyle(cfg.color, 0.9);
        g.fillTriangle(cx - 5, cy - h/2, cx + 8, cy - h/2 - s * 0.5, cx + 22, cy - h/2);
        // Tail
        g.fillStyle(cfg.color, 0.85);
        g.fillTriangle(cx - w/2, cy, cx - w/2 - s * 0.4, cy - h * 0.6, cx - w/2 - s * 0.4, cy + h * 0.5);
        // Eye
        g.fillStyle(0xeeeeff, 0.9);
        g.fillCircle(cx + w * 0.25, cy - h * 0.12, s * 0.08);
        g.fillStyle(0x111111, 1);
        g.fillCircle(cx + w * 0.26, cy - h * 0.12, s * 0.04);
        // Teeth
        g.fillStyle(0xffffff, 0.85);
        const teethCount = Math.floor(s / 10);
        for (let i = 0; i < teethCount; i++) {
            const tx = cx + w * 0.3 + i * 4;
            g.fillTriangle(tx, cy + h * 0.15, tx + 1.5, cy + h * 0.15 + 5, tx + 3, cy + h * 0.15);
        }
        // Pectoral fin
        g.fillStyle(cfg.color, 0.7);
        g.fillTriangle(cx - 5, cy + h * 0.3, cx + 5, cy + h * 0.3 + 12, cx + 15, cy + h * 0.3);
        g.generateTexture(key, w + 30, h + s * 0.5 + 20);
        g.destroy();
    }

    generateItems() {
        Object.entries(CONFIG.ITEMS).forEach(([key, cfg]) => {
            const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
            const r = 12;
            // Outer glow
            g.fillStyle(cfg.color, 0.15);
            g.fillCircle(r + 8, r + 8, r + 6);
            // Core
            g.fillStyle(cfg.color, 0.9);
            g.fillCircle(r + 8, r + 8, r);
            // Bright center
            g.fillStyle(0xffffff, 0.5);
            g.fillCircle(r + 6, r + 6, r * 0.35);
            g.generateTexture('item_' + key.toLowerCase(), (r + 8) * 2, (r + 8) * 2);
            g.destroy();
        });
    }

    generateBackgroundElements() {
        // Bubble
        const bg = this.scene.make.graphics({ x: 0, y: 0, add: false });
        bg.fillStyle(0xffffff, 0.15);
        bg.fillCircle(6, 6, 6);
        bg.lineStyle(1, 0xffffff, 0.25);
        bg.strokeCircle(6, 6, 6);
        bg.fillStyle(0xffffff, 0.3);
        bg.fillCircle(4, 4, 2);
        bg.generateTexture('bubble', 12, 12);
        bg.destroy();

        // Light ray particle
        const lr = this.scene.make.graphics({ x: 0, y: 0, add: false });
        lr.fillStyle(0xffffff, 0.03);
        lr.fillRect(0, 0, 4, 200);
        lr.generateTexture('light_ray', 4, 200);
        lr.destroy();

        // Seaweed segment
        const sw = this.scene.make.graphics({ x: 0, y: 0, add: false });
        sw.fillStyle(0x226644, 0.6);
        sw.fillEllipse(8, 40, 10, 80);
        sw.fillStyle(0x338855, 0.4);
        sw.fillEllipse(14, 35, 8, 60);
        sw.generateTexture('seaweed', 24, 80);
        sw.destroy();

        // Rock
        const rk = this.scene.make.graphics({ x: 0, y: 0, add: false });
        rk.fillStyle(0x334455, 0.7);
        rk.fillRoundedRect(0, 10, 50, 30, 8);
        rk.fillStyle(0x2a3a4a, 0.5);
        rk.fillRoundedRect(5, 5, 35, 20, 6);
        rk.generateTexture('rock', 50, 40);
        rk.destroy();

        // Coral
        const cr = this.scene.make.graphics({ x: 0, y: 0, add: false });
        cr.fillStyle(0xcc4466, 0.6);
        cr.fillCircle(15, 25, 12);
        cr.fillCircle(25, 15, 10);
        cr.fillCircle(35, 28, 11);
        cr.fillStyle(0xff6688, 0.3);
        cr.fillCircle(20, 20, 8);
        cr.generateTexture('coral', 50, 40);
        cr.destroy();
    }

    generateParticles() {
        // Glow particle
        const gp = this.scene.make.graphics({ x: 0, y: 0, add: false });
        gp.fillStyle(0x00ffcc, 0.4);
        gp.fillCircle(8, 8, 8);
        gp.fillStyle(0x00ffcc, 0.2);
        gp.fillCircle(8, 8, 4);
        gp.generateTexture('glow_particle', 16, 16);
        gp.destroy();

        // Impact particle
        const ip = this.scene.make.graphics({ x: 0, y: 0, add: false });
        ip.fillStyle(0xffffff, 0.7);
        ip.fillCircle(4, 4, 4);
        ip.generateTexture('impact_particle', 8, 8);
        ip.destroy();

        // Speed line
        const sl = this.scene.make.graphics({ x: 0, y: 0, add: false });
        sl.fillStyle(0xffffff, 0.2);
        sl.fillRect(0, 0, 20, 2);
        sl.generateTexture('speed_line', 20, 2);
        sl.destroy();
    }
}
