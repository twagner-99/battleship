class Ship {
    constructor(shipLength, hitCount = 0) {
        this.shipLength = shipLength;
        this.hitCount = hitCount;
        this.shipCoordinates = new Set();
        this.bufferCoordinates = new Set();
    }

    hit() {
        this.hitCount++;
    }

    isSunk() {
        if (this.hitCount === this.shipLength) {
            return true;
        }
        return false;
    }
}

export { Ship };