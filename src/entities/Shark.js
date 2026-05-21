// ============================================================
// Parasite Depths — Shark (Enemy) Entity
// ============================================================

class Shark extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, tier) {
        const cfg = CONFIG.SHARKS[tier];
        const key = 'shark_' + tier.toLowerCase();
        super(scene, x, y, key);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.tier = tier;
        this.cfg = cfg;
        this.setDepth(7);

        // Flip to face left (swimming left)
        this.setFlipX(true);

        // Hitbox
        const bw = cfg.size * 1.6, bh = cfg.size * 0.7;
        this.body.setSize(bw, bh);
        this.body.setOffset((this.width - bw) / 2, (this.height - bh) / 2);

        // Movement speed
        this.moveSpeed = cfg.speed;
        this.bobTimer = Math.random() * Math.PI * 2;
        this.bobAmp = 0.4 + Math.random() * 0.3;

        this.scored = false; // whether dodge points have been awarded
    }

    update(delta, scrollSpeed) {
        // Move left
        this.x -= (this.moveSpeed + scrollSpeed * 0.85) * (delta / 1000);

        // Subtle vertical bob
        this.bobTimer += delta * 0.002;
        this.y += Math.sin(this.bobTimer) * this.bobAmp;

        // Destroy when off-screen left
        if (this.x < -this.width) {
            this.scored = true;
            this.destroy();
            return true; // signal: dodged
        }
        return false;
    }
}
