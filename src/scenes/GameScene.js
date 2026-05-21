// ============================================================
// Parasite Depths — Game Scene (Main Gameplay)
// ============================================================

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        const w = CONFIG.WIDTH, h = CONFIG.HEIGHT;
        this.gameOver = false;
        this.scrollSpeed = CONFIG.BASE_SCROLL_SPEED;

        // --- Background ---
        this.bgGraphics = this.add.graphics();
        this.biomeSystem = new BiomeSystem(this);
        this._drawBackground();

        // Background decorations
        this.bgDecos = [];
        this._initBackgroundDecos();

        // Bubbles layer
        this.bgBubbles = [];
        for (let i = 0; i < 15; i++) {
            const bub = this.add.image(
                Phaser.Math.Between(0, w),
                Phaser.Math.Between(0, h),
                'bubble'
            );
            bub.setAlpha(0.08 + Math.random() * 0.12);
            bub.setScale(0.4 + Math.random() * 1.0);
            bub.setDepth(1);
            bub.vy = 15 + Math.random() * 20;
            this.bgBubbles.push(bub);
        }

        // Light rays
        for (let i = 0; i < 4; i++) {
            const ray = this.add.image(
                Phaser.Math.Between(0, w),
                0,
                'light_ray'
            );
            ray.setAlpha(0.025);
            ray.setScale(1 + Math.random(), 1);
            ray.setOrigin(0.5, 0);
            ray.setDepth(1);
            ray.setAngle(-8 + Math.random() * 16);
        }

        // Speed lines container
        this.speedLines = this.add.particles(0, 0, 'speed_line', {
            x: { min: 0, max: w },
            y: { min: 0, max: h },
            speedX: { min: -550, max: -300 },
            scale: { start: 1, end: 0.5 },
            alpha: { start: 0.1, end: 0 },
            lifespan: 800,
            frequency: 200,
            blendMode: Phaser.BlendModes.ADD,
        });
        this.speedLines.setDepth(2);

        // --- Entity groups ---
        this.sharkGroup = this.physics.add.group();
        this.hostGroup = this.physics.add.group();
        this.itemGroup = this.physics.add.group();

        // --- Player ---
        this.parasite = new Parasite(this, 150, h / 2);

        // --- Systems ---
        this.spawnSystem = new SpawnSystem(this);
        this.scoreSystem = new ScoreSystem(this);
        this.hostSystem = new HostSystem(this);
        this.collisionSystem = new CollisionSystem(this);

        this.collisionSystem.setup(
            this.parasite,
            this.sharkGroup,
            this.hostGroup,
            this.itemGroup,
            this.hostSystem,
            this.scoreSystem,
            () => this._onDeath()
        );

        // --- Input ---
        this.cursors = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        };

        // Also arrow keys
        const arrows = this.input.keyboard.createCursorKeys();
        this.cursorsAlt = {
            up: arrows.up,
            down: arrows.down,
        };

        // --- HUD Scene ---
        this.scene.launch('HUDScene', {
            scoreSystem: this.scoreSystem,
            hostSystem: this.hostSystem,
            biomeSystem: this.biomeSystem,
        });

        // --- Start music ---
        AUDIO.startMusic();

        // Biome announcement
        this._showBiomeAnnouncement(CONFIG.BIOMES[0].name);
    }

    update(time, delta) {
        if (this.gameOver) return;

        // Combined cursors
        const cursors = {
            up: { isDown: this.cursors.up.isDown || this.cursorsAlt.up.isDown },
            down: { isDown: this.cursors.down.isDown || this.cursorsAlt.down.isDown },
        };

        // Increase scroll speed (frame-rate independent, directly using seconds)
        this.scrollSpeed = Math.min(
            CONFIG.MAX_SCROLL_SPEED,
            this.scrollSpeed + CONFIG.SCROLL_ACCELERATION * (delta / 1000)
        );

        // Apply host speed multiplier
        const effectiveSpeed = this.scrollSpeed * this.hostSystem.getSpeedMultiplier();

        // Update systems
        this.scoreSystem.update(delta, effectiveSpeed);
        this.hostSystem.update(delta, this.parasite, cursors, effectiveSpeed);

        // Update parasite (only when free)
        if (!this.hostSystem.isControlling) {
            this.parasite.update(delta, cursors, effectiveSpeed);
        }

        // Spawning
        const spawned = this.spawnSystem.update(delta);
        spawned.sharks.forEach(s => this.sharkGroup.add(s));
        spawned.hosts.forEach(h => this.hostGroup.add(h));
        spawned.items.forEach(i => this.itemGroup.add(i));

        // Update sharks
        [...this.sharkGroup.getChildren()].forEach(shark => {
            if (shark.active) {
                const dodgePoints = shark.cfg.points_dodge;
                const dodged = shark.update(delta, effectiveSpeed);
                if (dodged) {
                    this.scoreSystem.addDodge(dodgePoints);
                    AUDIO.playDodge();
                }
            }
        });

        // Update free hosts
        [...this.hostGroup.getChildren()].forEach(host => {
            if (host.active && !host.possessed) {
                host.update(delta, null, effectiveSpeed);
            }
        });

        // Update items
        [...this.itemGroup.getChildren()].forEach(item => {
            if (item.active) item.update(delta, effectiveSpeed);
        });

        // Collision checks
        this.collisionSystem.update();

        // Biome transitions
        const newBiome = this.biomeSystem.update(this.scoreSystem.getDistance());
        if (newBiome) {
            this.spawnSystem.setBiomeMultiplier(newBiome.sharkMult);
            this._showBiomeAnnouncement(newBiome.name);
        }
        this.biomeSystem.lerpColors(0.02);
        this._drawBackground();

        // Animate background
        this._updateBackgroundDecos(delta, effectiveSpeed);
        this._updateBubbles(delta);

        // Speed lines intensity
        const speedRatio = this.scrollSpeed / CONFIG.MAX_SCROLL_SPEED;
        this.speedLines.frequency = Math.max(40, 200 - speedRatio * 180);
    }

    _drawBackground() {
        this.bgGraphics.clear();
        const top = this.biomeSystem.getTopColor();
        const bot = this.biomeSystem.getBotColor();
        this.bgGraphics.fillGradientStyle(top, top, bot, bot, 1);
        this.bgGraphics.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
        this.bgGraphics.setDepth(0);
    }

    _initBackgroundDecos() {
        const types = ['seaweed', 'rock', 'coral'];
        for (let i = 0; i < 12; i++) {
            const type = types[Phaser.Math.Between(0, types.length - 1)];
            const deco = this.add.image(
                Phaser.Math.Between(0, CONFIG.WIDTH),
                type === 'seaweed' ? CONFIG.HEIGHT - 10 : CONFIG.HEIGHT - Phaser.Math.Between(5, 25),
                type
            );
            deco.setOrigin(0.5, 1);
            deco.setAlpha(0.25 + Math.random() * 0.15);
            deco.setDepth(1);
            deco.setScale(0.6 + Math.random() * 0.8);
            deco.decoSpeed = 20 + Math.random() * 15;
            this.bgDecos.push(deco);
        }
    }

    _updateBackgroundDecos(delta, scrollSpeed) {
        this.bgDecos.forEach(deco => {
            deco.x -= (deco.decoSpeed + scrollSpeed * 0.6) * (delta / 1000);
            if (deco.x < -60) {
                deco.x = CONFIG.WIDTH + 60;
                deco.y = CONFIG.HEIGHT - Phaser.Math.Between(5, 30);
            }
        });
    }

    _updateBubbles(delta) {
        this.bgBubbles.forEach(bub => {
            bub.y -= bub.vy * (delta / 1000);
            if (bub.y < -20) {
                bub.y = CONFIG.HEIGHT + 20;
                bub.x = Phaser.Math.Between(0, CONFIG.WIDTH);
            }
        });
    }

    _showBiomeAnnouncement(name) {
        const text = this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 - 40, name.toUpperCase(), {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '20px',
            color: '#00ffcc',
            stroke: '#003322',
            strokeThickness: 3,
        }).setOrigin(0.5).setDepth(50).setAlpha(0);

        this.tweens.add({
            targets: text,
            alpha: 1,
            duration: 500,
            yoyo: true,
            hold: 1500,
            onComplete: () => text.destroy(),
        });
    }

    _onDeath() {
        if (this.gameOver) return;
        this.gameOver = true;

        // Flash effect
        this.cameras.main.flash(400, 255, 30, 30);
        this.cameras.main.shake(300, 0.02);

        AUDIO.stopMusic();

        // Save score
        this.scoreSystem.saveHighScore();

        // Brief pause then game over
        this.time.delayedCall(800, () => {
            this.scene.stop('HUDScene');
            this.scene.start('GameOverScene', {
                score: this.scoreSystem.getScore(),
                distance: this.scoreSystem.getDistance(),
                sharksDodged: this.scoreSystem.sharksDodged,
                sharksEaten: this.scoreSystem.sharksEaten,
                isNewHighScore: this.scoreSystem.isNewHighScore(),
                highScore: this.scoreSystem.highScore,
                bioMatterEarned: this.scoreSystem.calculateBioMatterEarned(),
                totalBioMatter: parseInt(localStorage.getItem('pd_biomatter') || '0', 10),
            });
        });
    }
}
