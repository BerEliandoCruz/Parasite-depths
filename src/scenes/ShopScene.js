// ============================================================
// Parasite Depths — Shop Scene (Skin Purchase & Equip)
// ============================================================

class ShopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ShopScene' });
    }

    create() {
        const w = CONFIG.WIDTH, h = CONFIG.HEIGHT;

        // Background gradient
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x02050c, 0x02050c, 0x051a24, 0x051a24, 1);
        bg.fillRect(0, 0, w, h);

        // Animated bubbles in background
        this.bubbles = [];
        for (let i = 0; i < 20; i++) {
            const bub = this.add.image(
                Phaser.Math.Between(0, w),
                Phaser.Math.Between(0, h),
                'bubble'
            );
            bub.setAlpha(0.1 + Math.random() * 0.15);
            bub.setScale(0.5 + Math.random() * 1.2);
            bub.speedY = 10 + Math.random() * 20;
            this.bubbles.push(bub);
        }

        // Title
        this.add.text(w / 2, 40, 'ABYSSAL MARKET', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '24px',
            color: '#00ffcc',
            stroke: '#003322',
            strokeThickness: 4,
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(w / 2, 70, 'Mutate your form. Adapt to survive.', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '8px',
            color: '#448877',
        }).setOrigin(0.5);

        // Local Storage Init
        this._initStorage();

        // Currency text
        this.currencyText = this.add.text(w - 30, 40, '', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '11px',
            color: '#00ffaa',
        }).setOrigin(1, 0.5);
        this._updateCurrencyDisplay();

        // State variables
        this.activeTab = 'parasite'; // 'parasite' | 'host'
        this.selectedSkinIndex = 0;

        // Lists to track interactive list elements
        this.listItems = [];

        // Left Container (Skin List)
        this.listContainer = this.add.container(60, 150);

        // Tabs
        this.tabParasite = this._createTabButton(w / 4, 110, 'PARASITES', () => this._switchTab('parasite'));
        this.tabHost = this._createTabButton((3 * w) / 4, 110, 'HOST FISH', () => this._switchTab('host'));
        this._updateTabStyles();

        // Preview Area (Right Side)
        this.previewContainer = this.add.container(w - 240, 240);
        
        // Preview Background Frame
        const pFrame = this.add.graphics();
        pFrame.fillStyle(0x040e1a, 0.6);
        pFrame.lineStyle(2, 0x00ffcc, 0.2);
        pFrame.fillRoundedRect(-140, -110, 280, 220, 8);
        pFrame.strokeRoundedRect(-140, -110, 280, 220, 8);
        this.previewContainer.add(pFrame);

        this.previewText = this.add.text(0, -90, 'PREVIEW', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '10px',
            color: '#5588aa',
        }).setOrigin(0.5);
        this.previewContainer.add(this.previewText);

        // Preview sprites list
        this.previewSprites = [];

        // Action/Buy Button
        this.actionBtn = this.add.text(w - 240, 400, '', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '14px',
            color: '#ffffff',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        this.actionBtnBg = this.add.graphics();
        this.actionBtn.on('pointerover', () => this._onActionButtonHover(true));
        this.actionBtn.on('pointerout', () => this._onActionButtonHover(false));
        this.actionBtn.on('pointerdown', () => this._onActionButtonClick());

        // Back Button
        const backBtn = this.add.text(60, h - 45, '← BACK TO MENU', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '11px',
            color: '#ff8866',
            padding: { x: 10, y: 5 },
        }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
        backBtn.on('pointerover', () => backBtn.setColor('#ffaa88').setScale(1.05));
        backBtn.on('pointerout', () => backBtn.setColor('#ff8866').setScale(1));
        backBtn.on('pointerdown', () => {
            AUDIO.playCollect();
            this.scene.start('MenuScene');
        });

        // Initialize first render
        this._renderSkinList();
        this._updatePreview();
    }

    update(time, delta) {
        // Animate bubbles
        this.bubbles.forEach(bub => {
            bub.y -= bub.speedY * (delta / 1000);
            if (bub.y < -20) {
                bub.y = CONFIG.HEIGHT + 20;
                bub.x = Phaser.Math.Between(0, CONFIG.WIDTH);
            }
        });

        // Simple floating animation for preview sprites
        const bob = Math.sin(time * 0.004) * 5;
        this.previewSprites.forEach((sprite, idx) => {
            if (this.activeTab === 'host') {
                // Stack previews slightly horizontally or vertically
                sprite.y = (-30 + idx * 40) + bob * (0.8 + idx * 0.2);
            } else {
                sprite.y = bob;
            }
        });
    }

    _initStorage() {
        if (!localStorage.getItem('pd_biomatter')) {
            localStorage.setItem('pd_biomatter', '0');
        }
        if (!localStorage.getItem('pd_parasite_skin')) {
            localStorage.setItem('pd_parasite_skin', 'classic');
        }
        if (!localStorage.getItem('pd_host_skin')) {
            localStorage.setItem('pd_host_skin', 'standard');
        }
        if (!localStorage.getItem('pd_owned_skins')) {
            localStorage.setItem('pd_owned_skins', JSON.stringify(['classic', 'standard']));
        }
    }

    _getOwnedSkins() {
        try {
            return JSON.parse(localStorage.getItem('pd_owned_skins') || '["classic", "standard"]');
        } catch (e) {
            return ['classic', 'standard'];
        }
    }

    _addOwnedSkin(id) {
        const owned = this._getOwnedSkins();
        if (!owned.includes(id)) {
            owned.push(id);
            localStorage.setItem('pd_owned_skins', JSON.stringify(owned));
        }
    }

    _updateCurrencyDisplay() {
        const cells = parseInt(localStorage.getItem('pd_biomatter') || '0', 10);
        this.currencyText.setText(`CELLS: ${cells}`);
    }

    _createTabButton(x, y, text, callback) {
        const btn = this.add.text(x, y, text, {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '12px',
            color: '#88ccbb',
            padding: { x: 16, y: 8 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerdown', () => {
            AUDIO.playCollect();
            callback();
        });
        return btn;
    }

    _switchTab(tab) {
        if (this.activeTab === tab) return;
        this.activeTab = tab;
        this.selectedSkinIndex = 0;
        this._updateTabStyles();
        this._renderSkinList();
        this._updatePreview();
    }

    _updateTabStyles() {
        if (this.activeTab === 'parasite') {
            this.tabParasite.setColor('#00ffcc').setScale(1.1);
            this.tabHost.setColor('#558877').setScale(1);
        } else {
            this.tabHost.setColor('#00ffcc').setScale(1.1);
            this.tabParasite.setColor('#558877').setScale(1);
        }
    }

    _renderSkinList() {
        // Clear previous items
        this.listItems.forEach(item => item.destroy());
        this.listItems = [];

        const skins = this.activeTab === 'parasite' ? CONFIG.SKINS.PARASITE : CONFIG.SKINS.HOST;
        const activeEquippedId = localStorage.getItem(this.activeTab === 'parasite' ? 'pd_parasite_skin' : 'pd_host_skin');
        const ownedSkins = this._getOwnedSkins();

        skins.forEach((skin, idx) => {
            const isSelected = idx === this.selectedSkinIndex;
            const isOwned = ownedSkins.includes(skin.id);
            const isEquipped = skin.id === activeEquippedId;

            // Container for list row
            const row = this.add.container(0, idx * 45);

            // Selection indicator dot
            const dot = this.add.circle(-15, 8, 4, isSelected ? 0x00ffcc : 0x0a2a3a);
            row.add(dot);

            // Skin Name
            const nameColor = isSelected ? '#ffffff' : (isEquipped ? '#00ffaa' : '#88aa99');
            const nameText = this.add.text(0, 0, skin.name.toUpperCase(), {
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '11px',
                color: nameColor,
            }).setInteractive({ useHandCursor: true });

            nameText.on('pointerdown', () => {
                AUDIO.playDodge();
                this.selectedSkinIndex = idx;
                this._renderSkinList();
                this._updatePreview();
            });
            row.add(nameText);

            // Status label
            let statusStr = '';
            let statusColor = '#556666';
            if (isEquipped) {
                statusStr = 'EQUIPPED';
                statusColor = '#00ffaa';
            } else if (isOwned) {
                statusStr = 'OWNED';
                statusColor = '#0088ff';
            } else {
                statusStr = `${skin.cost} CELLS`;
                statusColor = '#ffbb44';
            }

            const statusText = this.add.text(260, 1, statusStr, {
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '8px',
                color: statusColor,
            }).setOrigin(1, 0);
            row.add(statusText);

            // Underline highlight if selected
            if (isSelected) {
                const line = this.add.graphics();
                line.lineStyle(1, 0x00ffcc, 0.4);
                line.lineBetween(-20, 20, 270, 20);
                row.add(line);
            }

            this.listContainer.add(row);
            this.listItems.push(row);
        });
    }

    _updatePreview() {
        // Remove old sprites
        this.previewSprites.forEach(s => s.destroy());
        this.previewSprites = [];

        const skins = this.activeTab === 'parasite' ? CONFIG.SKINS.PARASITE : CONFIG.SKINS.HOST;
        const skin = skins[this.selectedSkinIndex];

        if (this.activeTab === 'parasite') {
            // Preview single Parasite body + glow
            const glow = this.add.image(0, 0, 'parasite_glow_' + skin.id);
            glow.setScale(2.2);
            glow.setBlendMode(Phaser.BlendModes.ADD);
            glow.setAlpha(0.5);
            
            const parasite = this.add.image(0, 0, 'parasite_' + skin.id);
            parasite.setScale(2.5);

            this.previewContainer.add(glow);
            this.previewContainer.add(parasite);

            this.previewSprites.push(glow, parasite);
        } else {
            // Preview three host tiers in stack
            const sFish = this.add.image(-50, -30, 'host_small_' + skin.id);
            sFish.setScale(1.2);

            const mFish = this.add.image(0, 10, 'host_medium_' + skin.id);
            mFish.setScale(1.2);

            const pFish = this.add.image(50, 50, 'host_predator_' + skin.id);
            pFish.setScale(1.1);

            this.previewContainer.add(sFish);
            this.previewContainer.add(mFish);
            this.previewContainer.add(pFish);

            this.previewSprites.push(sFish, mFish, pFish);
        }

        // Draw active action button details
        this._updateActionButtonState();
    }

    _updateActionButtonState() {
        const skins = this.activeTab === 'parasite' ? CONFIG.SKINS.PARASITE : CONFIG.SKINS.HOST;
        const skin = skins[this.selectedSkinIndex];
        const ownedSkins = this._getOwnedSkins();
        const activeEquippedId = localStorage.getItem(this.activeTab === 'parasite' ? 'pd_parasite_skin' : 'pd_host_skin');

        const isOwned = ownedSkins.includes(skin.id);
        const isEquipped = skin.id === activeEquippedId;

        // Clear action button graphical background
        this.actionBtnBg.clear();

        if (isEquipped) {
            this.actionBtn.setText('EQUIPPED').setColor('#558877').disableInteractive();
            this.actionBtnBg.fillStyle(0x0a1c18, 1);
            this.actionBtnBg.lineStyle(1, 0x00ffcc, 0.1);
        } else if (isOwned) {
            this.actionBtn.setText('EQUIP SKIN').setColor('#00ffcc').setInteractive({ useHandCursor: true });
            this.actionBtnBg.fillStyle(0x0c2c30, 1);
            this.actionBtnBg.lineStyle(2, 0x00ffcc, 0.6);
        } else {
            this.actionBtn.setText(`BUY: ${skin.cost} CELLS`).setColor('#ffbb44').setInteractive({ useHandCursor: true });
            this.actionBtnBg.fillStyle(0x2d1a0c, 1);
            this.actionBtnBg.lineStyle(2, 0xffaa00, 0.6);
        }

        // Draw button outline frame
        this.actionBtnBg.fillRoundedRect(CONFIG.WIDTH - 240 - 110, 380, 220, 40, 6);
        this.actionBtnBg.strokeRoundedRect(CONFIG.WIDTH - 240 - 110, 380, 220, 40, 6);
        
        // Ensure background is layered behind text button
        this.actionBtnBg.setDepth(4);
        this.actionBtn.setDepth(5);
    }

    _onActionButtonHover(hover) {
        const skins = this.activeTab === 'parasite' ? CONFIG.SKINS.PARASITE : CONFIG.SKINS.HOST;
        const skin = skins[this.selectedSkinIndex];
        const ownedSkins = this._getOwnedSkins();
        const activeEquippedId = localStorage.getItem(this.activeTab === 'parasite' ? 'pd_parasite_skin' : 'pd_host_skin');

        if (skin.id === activeEquippedId) return;

        if (hover) {
            this.actionBtn.setScale(1.05);
        } else {
            this.actionBtn.setScale(1);
        }
    }

    _onActionButtonClick() {
        const skins = this.activeTab === 'parasite' ? CONFIG.SKINS.PARASITE : CONFIG.SKINS.HOST;
        const skin = skins[this.selectedSkinIndex];
        const ownedSkins = this._getOwnedSkins();
        const activeEquippedId = localStorage.getItem(this.activeTab === 'parasite' ? 'pd_parasite_skin' : 'pd_host_skin');

        if (skin.id === activeEquippedId) return;

        const isOwned = ownedSkins.includes(skin.id);

        if (isOwned) {
            // Equip skin
            localStorage.setItem(
                this.activeTab === 'parasite' ? 'pd_parasite_skin' : 'pd_host_skin',
                skin.id
            );
            AUDIO.playCollect();
            this._renderSkinList();
            this._updatePreview();
        } else {
            // Purchase skin
            const cells = parseInt(localStorage.getItem('pd_biomatter') || '0', 10);
            if (cells >= skin.cost) {
                // Deduct cost
                localStorage.setItem('pd_biomatter', (cells - skin.cost).toString());
                // Add ownership
                this._addOwnedSkin(skin.id);
                // Auto equip
                localStorage.setItem(
                    this.activeTab === 'parasite' ? 'pd_parasite_skin' : 'pd_host_skin',
                    skin.id
                );

                AUDIO.playPossess();
                this._updateCurrencyDisplay();
                this._renderSkinList();
                this._updatePreview();
            } else {
                // Play buzzer or simple warning tone
                AUDIO.playImpact();
                
                // Shake currency text
                this.tweens.add({
                    targets: this.currencyText,
                    x: this.currencyText.x - 8,
                    duration: 50,
                    yoyo: true,
                    repeat: 3,
                    onComplete: () => {
                        this.currencyText.x = CONFIG.WIDTH - 30;
                    }
                });
            }
        }
    }
}
