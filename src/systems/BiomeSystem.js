// ============================================================
// Parasite Depths — Biome System
// ============================================================

class BiomeSystem {
    constructor(scene) {
        this.scene = scene;
        this.currentBiomeIndex = 0;
        this.targetTopColor = { r: 0, g: 0, b: 0 };
        this.targetBotColor = { r: 0, g: 0, b: 0 };
        this.currentTopColor = { r: 0, g: 0, b: 0 };
        this.currentBotColor = { r: 0, g: 0, b: 0 };
        this._setColorsFromHex(CONFIG.BIOMES[0].bgTop, this.currentTopColor);
        this._setColorsFromHex(CONFIG.BIOMES[0].bgTop, this.targetTopColor);
        this._setColorsFromHex(CONFIG.BIOMES[0].bgBot, this.currentBotColor);
        this._setColorsFromHex(CONFIG.BIOMES[0].bgBot, this.targetBotColor);
    }

    update(distance) {
        let newIndex = 0;
        for (let i = CONFIG.BIOMES.length - 1; i >= 0; i--) {
            if (distance >= CONFIG.BIOMES[i].distance) {
                newIndex = i;
                break;
            }
        }

        if (newIndex !== this.currentBiomeIndex) {
            this.currentBiomeIndex = newIndex;
            const biome = CONFIG.BIOMES[newIndex];
            this._setColorsFromHex(biome.bgTop, this.targetTopColor);
            this._setColorsFromHex(biome.bgBot, this.targetBotColor);
            AUDIO.playBiomeTransition();
            return biome; // new biome entered
        }
        return null;
    }

    lerpColors(speed) {
        this._lerpColor(this.currentTopColor, this.targetTopColor, speed);
        this._lerpColor(this.currentBotColor, this.targetBotColor, speed);
    }

    getTopColor() {
        return Phaser.Display.Color.GetColor(
            Math.floor(this.currentTopColor.r),
            Math.floor(this.currentTopColor.g),
            Math.floor(this.currentTopColor.b)
        );
    }

    getBotColor() {
        return Phaser.Display.Color.GetColor(
            Math.floor(this.currentBotColor.r),
            Math.floor(this.currentBotColor.g),
            Math.floor(this.currentBotColor.b)
        );
    }

    getCurrentBiome() {
        return CONFIG.BIOMES[this.currentBiomeIndex];
    }

    getSharkMultiplier() {
        return CONFIG.BIOMES[this.currentBiomeIndex].sharkMult;
    }

    _setColorsFromHex(hex, target) {
        target.r = (hex >> 16) & 0xFF;
        target.g = (hex >> 8) & 0xFF;
        target.b = hex & 0xFF;
    }

    _lerpColor(current, target, speed) {
        current.r += (target.r - current.r) * speed;
        current.g += (target.g - current.g) * speed;
        current.b += (target.b - current.b) * speed;
    }
}
