// ============================================================
// Parasite Depths — Boot Scene (Asset Loading)
// ============================================================

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // No external assets — everything is procedural
    }

    create() {
        // Generate all sprites
        const generator = new SpriteGenerator(this);
        generator.generateAll();

        // Update loading bar
        const bar = document.getElementById('load-bar');
        if (bar) bar.style.width = '100%';

        // Brief delay for loading screen visibility
        this.time.delayedCall(600, () => {
            const loadScreen = document.getElementById('loading-screen');
            if (loadScreen) {
                loadScreen.style.transition = 'opacity 0.5s';
                loadScreen.style.opacity = '0';
                setTimeout(() => loadScreen.style.display = 'none', 500);
            }
            this.scene.start('MenuScene');
        });
    }
}
