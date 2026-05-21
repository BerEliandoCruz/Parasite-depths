// ============================================================
// Parasite Depths — Menu Scene
// ============================================================

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const w = CONFIG.WIDTH, h = CONFIG.HEIGHT;

        // Background gradient
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x040a14, 0x040a14, 0x0a2a3a, 0x0a2a3a, 1);
        bg.fillRect(0, 0, w, h);

        // Animated bubbles in background
        this.bubbles = [];
        for (let i = 0; i < 30; i++) {
            const bub = this.add.image(
                Phaser.Math.Between(0, w),
                Phaser.Math.Between(0, h),
                'bubble'
            );
            bub.setAlpha(0.15 + Math.random() * 0.2);
            bub.setScale(0.5 + Math.random() * 1.5);
            bub.speedY = 10 + Math.random() * 25;
            bub.speedX = -5 + Math.random() * 10;
            this.bubbles.push(bub);
        }

        // Light rays
        for (let i = 0; i < 5; i++) {
            const ray = this.add.image(
                100 + i * 200 + Math.random() * 80,
                0,
                'light_ray'
            );
            ray.setAlpha(0.04 + Math.random() * 0.03);
            ray.setScale(1 + Math.random() * 2, 1);
            ray.setOrigin(0.5, 0);
            ray.setAngle(-5 + Math.random() * 10);
        }

        // Title
        this.add.text(w / 2, h * 0.18, 'PARASITE', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '42px',
            color: '#00ffcc',
            stroke: '#004433',
            strokeThickness: 4,
        }).setOrigin(0.5).setDepth(10);

        this.add.text(w / 2, h * 0.30, 'DEPTHS', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '52px',
            color: '#00ddaa',
            stroke: '#003322',
            strokeThickness: 6,
        }).setOrigin(0.5).setDepth(10);

        // Subtitle
        this.add.text(w / 2, h * 0.40, 'Sobreviva nas Profundezas. Domine o Oceano.', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '10px',
            color: '#448877',
        }).setOrigin(0.5).setDepth(10);

        // Floating parasite on title
        const activeSkinId = localStorage.getItem('pd_parasite_skin') || 'classic';

        const paraGlow = this.add.image(w / 2 - 160, h * 0.24, 'parasite_glow_' + activeSkinId);
        paraGlow.setScale(1.8);
        paraGlow.setDepth(10);
        paraGlow.setBlendMode(Phaser.BlendModes.ADD);
        paraGlow.setAlpha(0.5);

        const paraPreview = this.add.image(w / 2 - 160, h * 0.24, 'parasite_' + activeSkinId);
        paraPreview.setScale(2);
        paraPreview.setDepth(11);

        this.tweens.add({
            targets: [paraPreview, paraGlow],
            y: h * 0.24 + 8,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        // Buttons
        this._createButton(w / 2, h * 0.48, 'JOGAR', () => this._startGame());
        this._createButton(w / 2, h * 0.58, 'LOJA', () => this.scene.start('ShopScene'));
        this._createButton(w / 2, h * 0.68, 'CONTROLES', () => this._showControls());
        this._createButton(w / 2, h * 0.78, 'CRÉDITOS', () => this._showCredits());

        // Bio-matter / cells display in top-right
        const bioMatter = parseInt(localStorage.getItem('pd_biomatter') || '0', 10);
        this.add.text(w - 20, 20, 'CÉLULAS: ' + bioMatter, {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '10px',
            color: '#00ffaa',
        }).setOrigin(1, 0).setDepth(10);

        // High score
        const hs = parseInt(localStorage.getItem('pd_highscore') || '0', 10);
        if (hs > 0) {
            this.add.text(w / 2, h * 0.90, 'RECORDE: ' + hs, {
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '11px',
                color: '#ffdd44',
            }).setOrigin(0.5).setDepth(10);
        }

        // Controls overlay (hidden)
        this.controlsOverlay = this._createOverlay(
            'CONTROLES',
            'W — Nadar para Cima\nS — Nadar para Baixo\n\nColida com peixes para possuí-los\nComa tubarões enquanto possui\n\nSobreviva o máximo possível!'
        );

        // Credits overlay (hidden)
        this.creditsOverlay = this._createOverlay(
            'CRÉDITOS',
            'Parasite Depths\n\nUm endless runner no fundo do mar\n\nFeito com Phaser 3\n\n2025'
        );

        // Keyboard shortcut
        this.input.keyboard.on('keydown-SPACE', () => this._startGame());
        this.input.keyboard.on('keydown-ENTER', () => this._startGame());
    }

    update(time, delta) {
        // Animate bubbles
        this.bubbles.forEach(bub => {
            bub.y -= bub.speedY * (delta / 1000);
            bub.x += bub.speedX * (delta / 1000);
            if (bub.y < -20) {
                bub.y = CONFIG.HEIGHT + 20;
                bub.x = Phaser.Math.Between(0, CONFIG.WIDTH);
            }
        });
    }

    _createButton(x, y, text, callback) {
        const btn = this.add.text(x, y, text, {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '16px',
            color: '#88ffdd',
            padding: { x: 24, y: 12 },
        }).setOrigin(0.5).setDepth(10).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => {
            btn.setColor('#00ffcc');
            btn.setScale(1.1);
        });
        btn.on('pointerout', () => {
            btn.setColor('#88ffdd');
            btn.setScale(1);
        });
        btn.on('pointerdown', callback);
        return btn;
    }

    _createOverlay(title, body) {
        const w = CONFIG.WIDTH, h = CONFIG.HEIGHT;
        const container = this.add.container(0, 0);
        container.setDepth(100);
        container.setVisible(false);

        const bg = this.add.rectangle(w/2, h/2, w, h, 0x000000, 0.85);
        container.add(bg);

        container.add(this.add.text(w/2, h * 0.2, title, {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '24px',
            color: '#00ffcc',
        }).setOrigin(0.5));

        container.add(this.add.text(w/2, h * 0.5, body, {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '11px',
            color: '#88ccbb',
            align: 'center',
            lineSpacing: 8,
        }).setOrigin(0.5));

        const closeBtn = this.add.text(w/2, h * 0.85, 'FECHAR', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '14px',
            color: '#ff8866',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => container.setVisible(false));
        closeBtn.on('pointerover', () => closeBtn.setScale(1.1));
        closeBtn.on('pointerout', () => closeBtn.setScale(1));
        container.add(closeBtn);

        return container;
    }

    _startGame() {
        AUDIO.init();
        AUDIO.resume();
        this.scene.start('GameScene');
    }

    _showControls() {
        this.creditsOverlay.setVisible(false);
        this.controlsOverlay.setVisible(true);
    }

    _showCredits() {
        this.controlsOverlay.setVisible(false);
        this.creditsOverlay.setVisible(true);
    }
}
