// ============================================================
// Parasite Depths — Spawn System
// ============================================================

class SpawnSystem {
    constructor(scene) {
        this.scene = scene;
        this.sharkInterval = CONFIG.SPAWN.SHARK_INTERVAL_START;
        this.hostInterval = CONFIG.SPAWN.HOST_INTERVAL_START;
        this.itemInterval = CONFIG.SPAWN.ITEM_INTERVAL_START;
        this.sharkTimer = 0;
        this.hostTimer = 2000; // first host appears sooner
        this.itemTimer = 0;
        this.biomeMultiplier = 1;
    }

    update(delta) {
        this.sharkTimer += delta;
        this.hostTimer += delta;
        this.itemTimer += delta;

        const spawned = { sharks: [], hosts: [], items: [] };

        // Shark spawning
        if (this.sharkTimer >= this.sharkInterval) {
            this.sharkTimer = 0;
            this.sharkInterval = Math.max(
                CONFIG.SPAWN.SHARK_INTERVAL_MIN,
                this.sharkInterval * CONFIG.SPAWN.SHARK_INTERVAL_DECAY
            );
            spawned.sharks.push(this._spawnShark());
        }

        // Host spawning
        if (this.hostTimer >= this.hostInterval) {
            this.hostTimer = 0;
            spawned.hosts.push(this._spawnHost());
        }

        // Item spawning
        if (this.itemTimer >= this.itemInterval) {
            this.itemTimer = 0;
            spawned.items.push(this._spawnItem());
        }

        return spawned;
    }

    _spawnShark() {
        const margin = CONFIG.SPAWN.SAFE_MARGIN;
        const y = Phaser.Math.Between(margin, CONFIG.HEIGHT - margin);
        const x = CONFIG.WIDTH + 50;

        // Tier selection based on difficulty
        let tier = 'SMALL';
        const roll = Math.random() * this.biomeMultiplier;
        if (roll > 2.0) tier = 'LARGE';
        else if (roll > 1.2) tier = 'MEDIUM';

        return new Shark(this.scene, x, y, tier);
    }

    _spawnHost() {
        const margin = CONFIG.SPAWN.SAFE_MARGIN + 20;
        const y = Phaser.Math.Between(margin, CONFIG.HEIGHT - margin);
        const x = CONFIG.WIDTH + 40;

        // Tier selection: small most common
        const roll = Math.random();
        let tier = 'SMALL';
        if (roll > 0.85) tier = 'PREDATOR';
        else if (roll > 0.5) tier = 'MEDIUM';

        return new Host(this.scene, x, y, tier);
    }

    _spawnItem() {
        const margin = CONFIG.SPAWN.SAFE_MARGIN + 10;
        const y = Phaser.Math.Between(margin, CONFIG.HEIGHT - margin);
        const x = CONFIG.WIDTH + 30;

        const types = Object.keys(CONFIG.ITEMS);
        const roll = Math.random();
        let type = 'BIO_ENERGY';
        if (roll > 0.8) type = 'RARE_PARASITE';
        else if (roll > 0.5) type = 'TURBO';

        return new Item(this.scene, x, y, type);
    }

    setBiomeMultiplier(mult) {
        this.biomeMultiplier = mult;
    }
}
