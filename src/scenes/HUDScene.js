// ============================================================
// Parasite Depths — HUD Scene (Overlay UI)
// ============================================================

class HUDScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HUDScene' });
    }

    init(data) {
        this.scoreSystem = data.scoreSystem;
        this.hostSystem = data.hostSystem;
        this.biomeSystem = data.biomeSystem;
    }

    create() {
        const w = CONFIG.WIDTH;
        const pad = 16;

        // Score
        this.scoreLabel = this.add.text(pad, pad, 'PONTOS', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '8px',
            color: '#448877',
        });

        this.scoreText = this.add.text(pad, pad + 14, '0', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '16px',
            color: CONFIG.COLORS.HUD_TEXT,
        });

        // Distance
        this.distLabel = this.add.text(pad, pad + 40, 'DISTÂNCIA', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '8px',
            color: '#448877',
        });

        this.distText = this.add.text(pad, pad + 54, '0m', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '12px',
            color: '#88ccbb',
        });

        // Multiplier
        this.multText = this.add.text(w - pad, pad, 'x1.0', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '14px',
            color: '#ffdd44',
        }).setOrigin(1, 0);

        // Speed indicator
        this.speedText = this.add.text(w - pad, pad + 22, 'VEL: --', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '8px',
            color: '#556677',
        }).setOrigin(1, 0);

        // Biome name
        this.biomeText = this.add.text(w / 2, pad, '', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '8px',
            color: '#335566',
        }).setOrigin(0.5, 0);

        // --- Host Energy Bar ---
        this.hostBarContainer = this.add.container(w / 2, CONFIG.HEIGHT - 30);
        this.hostBarContainer.setVisible(false);

        // Bar background
        const barBg = this.add.rectangle(0, 0, 200, 14, 0x0a2a3a, 0.8);
        barBg.setStrokeStyle(1, 0x00ffcc, 0.4);
        this.hostBarContainer.add(barBg);

        // Bar fill
        this.hostBarFill = this.add.rectangle(-99, 0, 198, 10, 0x00ffaa, 1);
        this.hostBarFill.setOrigin(0, 0.5);
        this.hostBarContainer.add(this.hostBarFill);

        // Host name
        this.hostNameText = this.add.text(0, -16, '', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '8px',
            color: '#00ffcc',
        }).setOrigin(0.5, 1);
        this.hostBarContainer.add(this.hostNameText);

        // Energy label
        this.energyLabel = this.add.text(105, 0, 'NRG', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '7px',
            color: '#448877',
        }).setOrigin(0, 0.5);
        this.hostBarContainer.add(this.energyLabel);

        // Depth for all HUD elements
        this.children.each(child => child.setDepth(100));
    }

    update() {
        if (!this.scoreSystem) return;

        // Score
        this.scoreText.setText(this.scoreSystem.getScore().toLocaleString());

        // Distance
        this.distText.setText(this.scoreSystem.getDistance() + 'm');

        // Multiplier
        const mult = this.scoreSystem.getMultiplier();
        this.multText.setText('x' + mult.toFixed(1));
        if (mult >= 2) {
            this.multText.setColor('#ff8844');
        } else {
            this.multText.setColor('#ffdd44');
        }

        // Speed
        const gameScene = this.scene.get('GameScene');
        if (gameScene && gameScene.scrollSpeed) {
            const pct = Math.floor((gameScene.scrollSpeed / CONFIG.MAX_SCROLL_SPEED) * 100);
            this.speedText.setText('VEL: ' + pct + '%');
        }

        // Biome
        if (this.biomeSystem) {
            this.biomeText.setText(this.biomeSystem.getCurrentBiome().name);
        }

        // Host bar
        if (this.hostSystem && this.hostSystem.isControlling) {
            this.hostBarContainer.setVisible(true);
            const energyPct = this.hostSystem.getEnergyPercent();
            this.hostBarFill.setScale(Math.max(0.01, energyPct), 1);

            // Color changes when low
            if (energyPct < 0.25) {
                this.hostBarFill.setFillStyle(0xff4444);
                // Pulse effect
                this.hostBarFill.setAlpha(0.7 + Math.sin(Date.now() * 0.01) * 0.3);
            } else if (energyPct < 0.5) {
                this.hostBarFill.setFillStyle(0xffaa44);
                this.hostBarFill.setAlpha(1);
            } else {
                this.hostBarFill.setFillStyle(0x00ffaa);
                this.hostBarFill.setAlpha(1);
            }

            this.hostNameText.setText(this.hostSystem.getHostName());
        } else {
            this.hostBarContainer.setVisible(false);
        }
    }
}
