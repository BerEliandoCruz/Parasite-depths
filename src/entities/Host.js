// ============================================================
// Parasite Depths — Host (Possessable Fish) Entity
// ============================================================

class Host extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, tier) {
        const activeHostSkin = localStorage.getItem('pd_host_skin') || 'standard';
        const key = 'host_' + tier.toLowerCase() + '_' + activeHostSkin;
        
        super(scene, x, y, key);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.tier = tier;
        this.cfg = CONFIG.HOSTS[tier];
        this.normalKey = key;
        this.possessedKey = 'host_' + tier.toLowerCase() + '_p_' + activeHostSkin;
        this.setDepth(6);

        // Hitbox
        const bw = this.cfg.size * 1.4, bh = this.cfg.size * 0.8;
        this.body.setSize(bw, bh);
        this.body.setOffset((this.width - bw) / 2, (this.height - bh) / 2);

        this.possessed = false;
        this.energy = this.cfg.energy;       // seconds remaining
        this.maxEnergy = this.cfg.energy;
        this.health = this.cfg.health;
        this.maxHealth = this.cfg.health;
        this.moveSpeed = 80;            // free-swimming speed (before possession)
        this.velocityY = 0;
        this.bobTimer = Math.random() * Math.PI * 2;

        // Glow effect for when possessed
        const activeParasiteSkinId = localStorage.getItem('pd_parasite_skin') || 'classic';
        const parasiteSkin = CONFIG.SKINS.PARASITE.find(s => s.id === activeParasiteSkinId) || CONFIG.SKINS.PARASITE[0];

        this.possessGlow = scene.add.image(x, y, 'parasite_glow_' + parasiteSkin.id);
        this.possessGlow.setAlpha(0);
        this.possessGlow.setScale(1.5);
        this.possessGlow.setBlendMode(Phaser.BlendModes.ADD);
        this.possessGlow.setDepth(5);
        this.possessGlow.setTint(parasiteSkin.glow);
    }

    update(delta, cursors, scrollSpeed) {
        if (this.possessed) {
            this._updatePossessed(delta, cursors, scrollSpeed);
        } else {
            this._updateFree(delta, scrollSpeed);
        }
        this.possessGlow.setPosition(this.x, this.y);
    }

    _updateFree(delta, scrollSpeed) {
        // Free hosts swim left slowly (slower than sharks)
        this.x -= (this.moveSpeed + scrollSpeed * 0.75) * (delta / 1000);

        // Bob
        this.bobTimer += delta * 0.003;
        this.y += Math.sin(this.bobTimer) * 0.5;

        // Destroy if off-screen
        if (this.x < -this.width - 20) {
            this.destroy();
        }
    }

    _updatePossessed(delta, cursors, scrollSpeed) {
        const spd = CONFIG.PARASITE.VERTICAL_SPEED * this.cfg.speed_mult;
        const damp = CONFIG.PARASITE.INERTIA_DAMPING;

        // Vertical input
        if (cursors.up.isDown) {
            this.velocityY -= spd * (delta / 1000) * 8;
        } else if (cursors.down.isDown) {
            this.velocityY += spd * (delta / 1000) * 8;
        }
        this.velocityY *= damp;
        this.velocityY = Phaser.Math.Clamp(this.velocityY, -spd, spd);
        this.y += this.velocityY * (delta / 1000);
        this.y = Phaser.Math.Clamp(this.y, 40, CONFIG.HEIGHT - 40);

        // Energy depletion
        this.energy -= delta / 1000;

        // Glow pulses
        this.possessGlow.setAlpha(0.2 + Math.sin(Date.now() * 0.005) * 0.1);
    }

    possess() {
        this.possessed = true;
        this.setTexture(this.possessedKey);
        this.possessGlow.setAlpha(0.3);
        this.body.setCollideWorldBounds(true);
    }

    unpossess() {
        this.possessed = false;
        this.setTexture(this.normalKey);
        this.possessGlow.setAlpha(0);
        this.body.setCollideWorldBounds(false);
    }

    takeDamage(amount) {
        this.health -= amount;
        // Flash red
        this.setTint(0xff4444);
        this.scene.time.delayedCall(150, () => {
            if (this.active) this.clearTint();
        });
        return this.health <= 0;
    }

    healEnergy(percent) {
        this.energy = Math.min(this.maxEnergy, this.energy + this.maxEnergy * (percent / 100));
    }

    getEnergyPercent() {
        return Math.max(0, this.energy / this.maxEnergy);
    }

    getHealthPercent() {
        return Math.max(0, this.health / this.maxHealth);
    }

    destroy() {
        if (this.possessGlow) this.possessGlow.destroy();
        super.destroy();
    }
}
