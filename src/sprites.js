// ============================================================
// Parasite Depths — Procedural Sprite Generation
// ============================================================

class SpriteGenerator {
    constructor(scene) {
        this.scene = scene;
    }

    generateAll() {
        this.generateParasite();
        this.generateParasiteGlow();
        this.generateHosts();
        this.generateSharks();
        this.generateItems();
        this.generateBackgroundElements();
        this.generateParticles();
    }

    generateParasite() {
        const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
        const s = 18;
        // Body - bioluminescent blob
        g.fillStyle(0x00ddaa, 1);
        g.fillEllipse(s, s, s * 1.6, s * 1.2);
        // Inner glow
        g.fillStyle(0x00ffcc, 0.6);
        g.fillEllipse(s, s, s * 0.9, s * 0.7);
        // Core bright spot
        g.fillStyle(0x88ffee, 0.8);
        g.fillEllipse(s - 2, s - 2, s * 0.4, s * 0.3);
        // Eye
        g.fillStyle(0xffffff, 0.9);
        g.fillCircle(s + 4, s - 3, 3);
        g.fillStyle(0x000000, 1);
        g.fillCircle(s + 5, s - 3, 1.5);
        // Tentacles
        g.lineStyle(2, 0x00ccaa, 0.7);
        g.beginPath();
        g.moveTo(s - 10, s + 2);
        g.lineTo(s - 16, s + 6);
        g.moveTo(s - 10, s + 5);
        g.lineTo(s - 17, s + 10);
        g.moveTo(s - 8, s + 7);
        g.lineTo(s - 14, s + 13);
        g.strokePath();
        g.generateTexture('parasite', s * 2, s * 2);
        g.destroy();
    }

    generateParasiteGlow() {
        const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
        const r = 30;
        g.fillStyle(0x00ffcc, 0.15);
        g.fillCircle(r, r, r);
        g.fillStyle(0x00ffcc, 0.08);
        g.fillCircle(r, r, r * 0.6);
        g.generateTexture('parasite_glow', r * 2, r * 2);
        g.destroy();
    }

    generateHosts() {
        this._generateFish('host_small', 28, CONFIG.HOSTS.SMALL.color, false);
        this._generateFish('host_small_p', 28, CONFIG.HOSTS.SMALL.color, true);
        this._generateFish('host_medium', 42, CONFIG.HOSTS.MEDIUM.color, false);
        this._generateFish('host_medium_p', 42, CONFIG.HOSTS.MEDIUM.color, true);
        this._generatePredator('host_predator', 60, CONFIG.HOSTS.PREDATOR.color, false);
        this._generatePredator('host_predator_p', 60, CONFIG.HOSTS.PREDATOR.color, true);
    }

    _generateFish(key, size, color, possessed) {
        const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
        const w = size * 2, h = size * 1.2;
        const cx = w / 2 + 10, cy = h / 2 + 10;
        // Body
        g.fillStyle(color, 1);
        g.fillEllipse(cx, cy, w, h);
        // Belly
        g.fillStyle(0xffffff, 0.15);
        g.fillEllipse(cx, cy + h * 0.15, w * 0.7, h * 0.4);
        // Tail
        g.fillStyle(color, 0.8);
        g.fillTriangle(cx - w/2 - 5, cy, cx - w/2 - 18, cy - h * 0.4, cx - w/2 - 18, cy + h * 0.4);
        // Eye
        g.fillStyle(0xffffff, 0.9);
        g.fillCircle(cx + w * 0.25, cy - h * 0.1, size * 0.12);
        g.fillStyle(0x000000, 1);
        g.fillCircle(cx + w * 0.27, cy - h * 0.1, size * 0.06);
        // Dorsal fin
        g.fillStyle(color, 0.6);
        g.fillTriangle(cx - 5, cy - h/2, cx + 10, cy - h/2 - 10, cx + 15, cy - h/2 + 5);
        if (possessed) {
            g.lineStyle(2, 0x00ffcc, 0.8);
            g.strokeEllipse(cx, cy, w + 6, h + 6);
            g.fillStyle(0x00ffcc, 0.1);
            g.fillEllipse(cx, cy, w + 12, h + 12);
        }
        g.generateTexture(key, w + 30, h + 30);
        g.destroy();
    }

    _generatePredator(key, size, color, possessed) {
        const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
        const w = size * 2.2, h = size * 1.0;
        const cx = w / 2 + 15, cy = h / 2 + 15;
        // Body - more angular
        g.fillStyle(color, 1);
        g.fillEllipse(cx, cy, w, h);
        // Jaw
        g.fillStyle(color, 0.9);
        g.fillTriangle(cx + w/2, cy, cx + w/2 + 15, cy - 5, cx + w/2 + 15, cy + 8);
        // Teeth
        g.fillStyle(0xffffff, 0.9);
        for (let i = 0; i < 4; i++) {
            g.fillTriangle(cx + w/2 + 2 + i*3, cy + 2, cx + w/2 + 3 + i*3, cy + 6, cx + w/2 + 4 + i*3, cy + 2);
        }
        // Eye (angry)
        g.fillStyle(0xff4444, 0.9);
        g.fillCircle(cx + w * 0.2, cy - h * 0.15, size * 0.1);
        g.fillStyle(0x000000, 1);
        g.fillCircle(cx + w * 0.22, cy - h * 0.15, size * 0.05);
        // Dorsal fin
        g.fillStyle(color, 0.7);
        g.fillTriangle(cx - 10, cy - h/2, cx + 5, cy - h/2 - 18, cx + 20, cy - h/2);
        // Tail
        g.fillStyle(color, 0.8);
        g.fillTriangle(cx - w/2 - 5, cy, cx - w/2 - 22, cy - h * 0.5, cx - w/2 - 22, cy + h * 0.5);
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
