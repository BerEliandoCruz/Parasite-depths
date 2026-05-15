// ============================================================
// Parasite Depths — Parasite (Player) Entity
// ============================================================

class Parasite extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'parasite');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setDepth(10);
        this.body.setCollideWorldBounds(true);
        this.body.setSize(20, 20);
        this.body.setOffset(8, 8);

        this.velocityY = 0;
        this.state = 'free'; // 'free' | 'possessing'
        this.invincible = false;
        this.invincibleTimer = null;

        // Glow sprite
        this.glow = scene.add.image(x, y, 'parasite_glow');
        this.glow.setAlpha(0.4);
        this.glow.setDepth(9);
        this.glow.setBlendMode(Phaser.BlendModes.ADD);

        // Bioluminescent trail
        this.trail = scene.add.particles(0, 0, 'glow_particle', {
            follow: this,
            followOffset: { x: -12, y: 0 },
            speed: { min: 10, max: 30 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.5, end: 0 },
            lifespan: 400,
            frequency: 60,
            blendMode: Phaser.BlendModes.ADD,
        });
        this.trail.setDepth(8);

        this.bobTimer = 0;
    }

    update(delta, cursors, scrollSpeed) {
        if (this.state === 'possessing') {
            this.setVisible(false);
            this.glow.setVisible(false);
            this.trail.stop();
            return;
        }

        this.setVisible(true);
        this.glow.setVisible(true);
        if (!this.trail.emitting) this.trail.start();

        // Vertical movement with inertia
        const spd = CONFIG.PARASITE.VERTICAL_SPEED;
        const damp = CONFIG.PARASITE.INERTIA_DAMPING;

        if (cursors.up.isDown) {
            this.velocityY -= spd * (delta / 1000) * 8;
        } else if (cursors.down.isDown) {
            this.velocityY += spd * (delta / 1000) * 8;
        }

        this.velocityY *= damp;
        this.velocityY = Phaser.Math.Clamp(this.velocityY, -spd, spd);

        this.y += this.velocityY * (delta / 1000);
        this.y = Phaser.Math.Clamp(this.y, 40, CONFIG.HEIGHT - 40);

        // Subtle bob
        this.bobTimer += delta * 0.003;
        this.y += Math.sin(this.bobTimer) * 0.3;

        // Glow follows
        this.glow.setPosition(this.x, this.y);

        // Invincibility flash
        if (this.invincible) {
            this.setAlpha(Math.sin(Date.now() * 0.015) > 0 ? 1 : 0.3);
        } else {
            this.setAlpha(1);
        }
    }

    makeInvincible(duration) {
        this.invincible = true;
        if (this.invincibleTimer) clearTimeout(this.invincibleTimer);
        this.invincibleTimer = setTimeout(() => {
            this.invincible = false;
            this.setAlpha(1);
        }, duration);
    }

    enterHost() {
        this.state = 'possessing';
        this.setVisible(false);
        this.glow.setVisible(false);
        this.trail.stop();
    }

    exitHost(x, y) {
        this.state = 'free';
        this.setPosition(x, y);
        this.setVisible(true);
        this.glow.setVisible(true);
        this.trail.start();
        this.makeInvincible(CONFIG.PARASITE.INVINCIBLE_AFTER_EJECT);
        this.velocityY = 0;
    }

    destroy() {
        if (this.glow) this.glow.destroy();
        if (this.trail) this.trail.destroy();
        if (this.invincibleTimer) clearTimeout(this.invincibleTimer);
        super.destroy();
    }
}
