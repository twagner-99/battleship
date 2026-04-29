class Ship {
    constructor(shipLength, hitCount = 0, sunkStatus = false) {
        this.shipLength = shipLength;
        this.hitCount = hitCount;
        this.sunkStatus = sunkStatus;
        this.coordinates = new Set();
    }

    hit() {
        this.hitCount++;
    }

    isSunk() {
        if (this.hitCount === this.shipLength) {
            this.sunkStatus = true;
            return true;
        }
        return false;
    }
}

export { Ship };