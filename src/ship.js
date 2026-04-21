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

// Will likely want to create this fleet in gameboard.js
const fleet = {
    'carrier': new Ship(5),
    'battleship': new Ship(4),
    'destroyer': new Ship(3),
    'submarine': new Ship(3),
    'patrolBoat': new Ship(2),
}

export { Ship };