// ============================================================
// Parasite Depths — Game Over Scene
// ============================================================

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.finalDistance = data.distance || 0;
        this.sharksDodged = data.sharksDodged || 0;
        this.sharksEaten = data.sharksEaten || 0;
        this.isNewHighScore = data.isNewHighScore || false;
        this.highScore = data.highScore || 0;
        this.bioMatterEarned = data.bioMatterEarned || 0;
        this.totalBioMatter = data.totalBioMatter || 0;
    }

    create() {
        const w = CONFIG.WIDTH, h = CONFIG.HEIGHT;

        // Dark background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x0a0408, 0x0a0408, 0x140a14, 0x140a14, 1);
        bg.fillRect(0, 0, w, h);

        // Floating bubbles
        this.bubbles = [];
        for (let i = 0; i < 15; i++) {
            const bub = this.add.image(
                Phaser.Math.Between(0, w),
                Phaser.Math.Between(0, h),
                'bubble'
            );
            bub.setAlpha(0.08 + Math.random() * 0.1);
            bub.setScale(0.3 + Math.random() * 0.8);
            bub.vy = 8 + Math.random() * 15;
            this.bubbles.push(bub);
        }

        // Title
        const titleColor = this.isNewHighScore ? '#ffdd44' : '#ff4444';
        this.add.text(w / 2, h * 0.12, 'GAME OVER', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '32px',
            color: titleColor,
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);

        // New high score celebration
        if (this.isNewHighScore) {
            const hsText = this.add.text(w / 2, h * 0.20, '★ NEW HIGH SCORE! ★', {
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '14px',
                color: '#ffdd44',
            }).setOrigin(0.5);

            this.tweens.add({
                targets: hsText,
                scale: 1.15,
                duration: 600,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
            });
        }

        // Stats
        const statsY = h * 0.28;
        const stats = [
            { label: 'SCORE', value: this.finalScore.toLocaleString(), color: '#00ffcc' },
            { label: 'DISTANCE', value: this.finalDistance + 'm', color: '#88ccbb' },
            { label: 'SHARKS', value: `${this.sharksEaten} Eaten / ${this.sharksDodged} Dodged`, color: '#ffaa66' },
            { label: 'BIO-MATTER EARNED', value: '+' + this.bioMatterEarned.toString(), color: '#44ff88' },
            { label: 'TOTAL BIO-MATTER', value: this.totalBioMatter.toString(), color: '#00ffaa' },
            { label: 'HIGH SCORE', value: this.highScore.toLocaleString(), color: '#ffdd44' },
        ];

        stats.forEach((stat, i) => {
            const y = statsY + i * 32;
            this.add.text(w * 0.22, y, stat.label, {
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '9px',
                color: '#556666',
            }).setOrigin(0, 0);
            this.add.text(w * 0.78, y, stat.value, {
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '11px',
                color: stat.color,
            }).setOrigin(1, 0);
        });

        // Buttons
        const btnY = h * 0.85;
        this._createButton(w / 2 - 130, btnY, 'RETRY', () => {
            this.scene.start('GameScene');
        });
        this._createButton(w / 2, btnY, 'SHOP', () => {
            this.scene.start('ShopScene');
        });
        this._createButton(w / 2 + 130, btnY, 'MENU', () => {
            this.scene.start('MenuScene');
        });

        // Keyboard shortcuts
        this.input.keyboard.on('keydown-SPACE', () => this.scene.start('GameScene'));
        this.input.keyboard.on('keydown-ENTER', () => this.scene.start('GameScene'));
        this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));
    }

    update(time, delta) {
        this.bubbles.forEach(bub => {
            bub.y -= bub.vy * (delta / 1000);
            if (bub.y < -20) {
                bub.y = CONFIG.HEIGHT + 20;
                bub.x = Phaser.Math.Between(0, CONFIG.WIDTH);
            }
        });
    }

    _createButton(x, y, text, callback) {
        const btn = this.add.text(x, y, text, {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '14px',
            color: '#88ffdd',
            padding: { x: 16, y: 10 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => { btn.setColor('#00ffcc'); btn.setScale(1.1); });
        btn.on('pointerout', () => { btn.setColor('#88ffdd'); btn.setScale(1); });
        btn.on('pointerdown', callback);
        return btn;
    }
}
