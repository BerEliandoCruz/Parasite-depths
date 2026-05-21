// ============================================================
// Parasite Depths — Main Entry Point
// ============================================================

window.addEventListener('load', () => {
    const config = {
        type: Phaser.AUTO,
        width: CONFIG.WIDTH,
        height: CONFIG.HEIGHT,
        parent: 'game-container',
        backgroundColor: '#040a14',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false,
            },
        },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        render: {
            pixelArt: false,
            antialias: true,
        },
        scene: [BootScene, MenuScene, GameScene, HUDScene, GameOverScene, ShopScene],
    };

    const game = new Phaser.Game(config);
});
