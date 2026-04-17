class Ship {
    constructor(shipLength, hitCount = 0, sunkStatus = false) {
        this.shipLength = shipLength;
        this.hitCount = hitCount;
        this.sunkStatus = sunkStatus;
        this.coordinates = new Set(); // Using a set for easy comparison to hit gameboard tiles.
    }

    hit() {
        if (true) this.shipLength += 1; // Update if condition
    }

    isSunk() {
        if (this.hitCount === this.shipLength) return true;
        return false;
    }
}

const fleet = {
    'carrier': new Ship(5),
    'battleship': new Ship(4),
    'destroyer': new Ship(3),
    'submarine': new Ship(3),
    'patrolBoat': new Ship(2),
}

export { fleet };