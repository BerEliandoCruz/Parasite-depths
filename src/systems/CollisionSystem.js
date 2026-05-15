// ============================================================
// Parasite Depths — Collision System
// ============================================================

class CollisionSystem {
    constructor(scene) {
        this.scene = scene;
    }

    setup(parasite, sharkGroup, hostGroup, itemGroup, hostSystem, scoreSystem, onDeath) {
        this.parasite = parasite;
        this.hostSystem = hostSystem;
        this.scoreSystem = scoreSystem;
        this.onDeath = onDeath;

        // 1. Parasite x Shark → death (if not invincible, not possessing)
        scene.physics.add.overlap(parasite, sharkGroup, (p, shark) => {
            if (p.state === 'possessing' || p.invincible) return;
            AUDIO.playDeath();
            this.onDeath();
        });

        // 2. Parasite x Host → possession
        scene.physics.add.overlap(parasite, hostGroup, (p, host) => {
            if (p.state === 'possessing' || p.invincible) return;
            if (host.possessed) return;
            hostSystem.possess(parasite, host);
        });

        // 3. Parasite x Items → collect (when free)
        scene.physics.add.overlap(parasite, itemGroup, (p, item) => {
            if (p.state === 'possessing') return;
            // Items still give points when free, but no host-specific effects
            scoreSystem.addItemPoints(item.cfg.points);
            AUDIO.playCollect();
            this._spawnCollectEffect(item.x, item.y, item.cfg.color);
            item.destroy();
        });

        // Store groups for host-based collisions (checked in update)
        this.sharkGroup = sharkGroup;
        this.hostGroup = hostGroup;
        this.itemGroup = itemGroup;
    }

    update() {
        if (!this.hostSystem.isControlling) return;

        const host = this.hostSystem.currentHost;
        if (!host || !host.active) return;

        // Host x Shark
        this.sharkGroup.getChildren().forEach(shark => {
            if (!shark.active) return;
            if (!Phaser.Geom.Intersects.RectangleToRectangle(
                host.getBounds(), shark.getBounds()
            )) return;

            const result = this.hostSystem.handleSharkCollision(shark, this.scoreSystem);

            if (result === 'eat') {
                this._spawnEatEffect(shark.x, shark.y);
                shark.destroy();
            } else if (result === 'damaged') {
                this._spawnImpactEffect(host.x, host.y);
                shark.destroy();
            } else if (result === 'destroyed') {
                this._spawnImpactEffect(host.x, host.y);
                shark.destroy();
                this.hostSystem.eject(this.parasite);
            }
        });

        // Host x Items
        this.itemGroup.getChildren().forEach(item => {
            if (!item.active) return;
            if (!Phaser.Geom.Intersects.RectangleToRectangle(
                host.getBounds(), item.getBounds()
            )) return;

            this.hostSystem.handleItemCollect(item, this.scoreSystem);
            this._spawnCollectEffect(item.x, item.y, item.cfg.color);
            item.destroy();
        });
    }

    _spawnEatEffect(x, y) {
        if (!this.scene || !this.scene.add) return;
        const particles = this.scene.add.particles(x, y, 'impact_particle', {
            speed: { min: 50, max: 150 },
            scale: { start: 1.5, end: 0 },
            alpha: { start: 0.8, end: 0 },
            tint: 0xff4444,
            lifespan: 400,
            quantity: 12,
            blendMode: Phaser.BlendModes.ADD,
        });
        particles.setDepth(15);
        this.scene.time.delayedCall(500, () => particles.destroy());
    }

    _spawnImpactEffect(x, y) {
        if (!this.scene || !this.scene.add) return;
        const particles = this.scene.add.particles(x, y, 'impact_particle', {
            speed: { min: 30, max: 100 },
            scale: { start: 1, end: 0 },
            alpha: { start: 0.6, end: 0 },
            tint: 0xffaa44,
            lifespan: 300,
            quantity: 8,
            blendMode: Phaser.BlendModes.ADD,
        });
        particles.setDepth(15);
        this.scene.time.delayedCall(400, () => particles.destroy());
    }

    _spawnCollectEffect(x, y, color) {
        if (!this.scene || !this.scene.add) return;
        const particles = this.scene.add.particles(x, y, 'glow_particle', {
            speed: { min: 20, max: 80 },
            scale: { start: 1.2, end: 0 },
            alpha: { start: 0.7, end: 0 },
            tint: color,
            lifespan: 500,
            quantity: 10,
            blendMode: Phaser.BlendModes.ADD,
        });
        particles.setDepth(15);
        this.scene.time.delayedCall(600, () => particles.destroy());
    }
}
