// ============================================================
// Parasite Depths — Collectible Item Entity
// ============================================================

class Item extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        const cfg = CONFIG.ITEMS[type];
        super(scene, x, y, 'item_' + type.toLowerCase());
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.type = type;
        this.cfg = cfg;
        this.setDepth(5);

        this.body.setSize(18, 18);
        this.body.setOffset((this.width - 18) / 2, (this.height - 18) / 2);

        this.bobTimer = Math.random() * Math.PI * 2;
        this.baseY = y;

        // Floating glow
        this.setBlendMode(Phaser.BlendModes.ADD);
    }

    update(delta, scrollSpeed) {
        this.x -= (60 + scrollSpeed * 0.8) * (delta / 1000);

        // Float bob
        this.bobTimer += delta * 0.004;
        this.y = this.baseY + Math.sin(this.bobTimer) * 8;

        // Pulse scale
        this.setScale(0.9 + Math.sin(this.bobTimer * 1.5) * 0.15);

        if (this.x < -30) {
            this.destroy();
        }
    }
}
