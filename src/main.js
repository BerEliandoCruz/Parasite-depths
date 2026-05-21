// ============================================================
// Parasite Depths — Main Entry Point
// ============================================================

window.addEventListener('load', () => {
    // Força o reset das células e progresso a pedido do usuário
    if (!localStorage.getItem('pd_reset_v1')) {
        localStorage.clear();
        localStorage.setItem('pd_reset_v1', 'true');
        console.log('Progresso resetado com sucesso!');
    }

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
