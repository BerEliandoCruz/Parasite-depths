// ============================================================
// Parasite Depths — Host Possession System
// ============================================================

class HostSystem {
    constructor(scene) {
        this.scene = scene;
        this.currentHost = null;
        this.state = 'seeking'; // 'seeking' | 'controlling' | 'ejecting'
        this.speedBoost = 1;
        this.speedBoostTimer = 0;
    }

    get isControlling() {
        return this.state === 'controlling' && this.currentHost !== null;
    }

    possess(parasite, host) {
        if (this.state === 'controlling') return false;

        this.currentHost = host;
        this.state = 'controlling';
        host.possess();
        parasite.enterHost();

        // Position host where parasite was
        host.setPosition(parasite.x, parasite.y);

        AUDIO.playPossess();
        return true;
    }

    eject(parasite) {
        if (!this.currentHost) return;

        this.state = 'ejecting';
        const host = this.currentHost;
        const x = host.x;
        const y = host.y;

        host.unpossess();
        host.destroy();
        this.currentHost = null;

        parasite.exitHost(x, y);

        AUDIO.playEject();

        this.state = 'seeking';
    }

    update(delta, parasite, cursors, scrollSpeed) {
        if (!this.isControlling) return;

        this.currentHost.update(delta, cursors, scrollSpeed);

        // Check energy depletion
        if (this.currentHost.energy <= 0) {
            this.eject(parasite);
            return;
        }

        // Speed boost timer
        if (this.speedBoostTimer > 0) {
            this.speedBoostTimer -= delta;
            if (this.speedBoostTimer <= 0) {
                this.speedBoost = 1;
            }
        }
    }

    getSpeedMultiplier() {
        if (!this.isControlling) return 1;
        return this.currentHost.cfg.speed_mult * this.speedBoost;
    }

    handleSharkCollision(shark, scoreSystem) {
        if (!this.currentHost) return 'miss';

        const hostAttack = this.currentHost.cfg.attack;
        const sharkAttack = CONFIG.SHARKS[shark.tier].attack;

        if (hostAttack >= sharkAttack) {
            // Host eats the shark
            scoreSystem.addEat(shark.cfg.points_eat);
            AUDIO.playBite();
            return 'eat';
        } else {
            // Shark damages host
            const destroyed = this.currentHost.takeDamage(sharkAttack * 25);
            AUDIO.playImpact();
            if (destroyed) {
                return 'destroyed';
            }
            return 'damaged';
        }
    }

    handleItemCollect(item, scoreSystem) {
        const cfg = item.cfg;
        scoreSystem.addItemPoints(cfg.points);
        AUDIO.playCollect();

        switch (cfg.effect) {
            case 'heal':
                if (this.currentHost) {
                    this.currentHost.healEnergy(cfg.value);
                }
                break;
            case 'multiplier':
                scoreSystem.setTempMultiplier(cfg.value, cfg.duration);
                break;
            case 'speed':
                this.speedBoost = cfg.value;
                this.speedBoostTimer = cfg.duration;
                break;
        }
    }

    getEnergyPercent() {
        if (!this.currentHost) return 0;
        return this.currentHost.getEnergyPercent();
    }

    getHealthPercent() {
        if (!this.currentHost) return 0;
        return this.currentHost.getHealthPercent();
    }

    getHostName() {
        if (!this.currentHost) return '';
        return this.currentHost.cfg.name;
    }
}
