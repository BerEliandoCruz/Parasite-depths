// ============================================================
// Parasite Depths — Score System
// ============================================================

class ScoreSystem {
    constructor(scene) {
        this.scene = scene;
        this.score = 0;
        this.distance = 0;
        this.multiplier = CONFIG.SCORE.MULTIPLIER_BASE;
        this.multiplierTimer = 0;
        this.tempMultiplier = 1;
        this.tempMultTimer = 0;
        this.sharksDodged = 0;
        this.sharksEaten = 0;
        this.itemsCollected = 0;
        this.highScore = parseInt(localStorage.getItem('pd_highscore') || '0', 10);
    }

    update(delta, scrollSpeed) {
        // Distance scoring
        const dist = scrollSpeed * (delta / 1000) * 0.1;
        this.distance += dist;
        this.score += dist * CONFIG.SCORE.DISTANCE_RATE * this.getMultiplier();

        // Grow multiplier over time
        this.multiplierTimer += delta / 1000;
        this.multiplier = Math.min(
            CONFIG.SCORE.MULTIPLIER_MAX,
            CONFIG.SCORE.MULTIPLIER_BASE + this.multiplierTimer * CONFIG.SCORE.MULTIPLIER_GROWTH
        );

        // Temp multiplier countdown
        if (this.tempMultTimer > 0) {
            this.tempMultTimer -= delta;
            if (this.tempMultTimer <= 0) {
                this.tempMultiplier = 1;
                this.tempMultTimer = 0;
            }
        }
    }

    getMultiplier() {
        return this.multiplier * this.tempMultiplier;
    }

    addDodge(points) {
        this.sharksDodged++;
        this.score += points * this.getMultiplier();
    }

    addEat(points) {
        this.sharksEaten++;
        this.score += points * this.getMultiplier();
    }

    addItemPoints(points) {
        this.itemsCollected++;
        this.score += points * this.getMultiplier();
    }

    setTempMultiplier(value, duration) {
        this.tempMultiplier = value;
        this.tempMultTimer = duration;
    }

    getScore() {
        return Math.floor(this.score);
    }

    getDistance() {
        return Math.floor(this.distance);
    }

    isNewHighScore() {
        return this.getScore() > this.highScore;
    }

    saveHighScore() {
        if (this.isNewHighScore()) {
            this.highScore = this.getScore();
            localStorage.setItem('pd_highscore', this.highScore.toString());
        }
    }
}
