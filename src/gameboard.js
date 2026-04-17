class Gameboard {
    constructor() {
        // Could be a good candidate for a set b/c we can't have duplicates
        this.hitTracker = new Set();   // Will track if a spot has already been hit. Using a set bc it doesn't allow duplicates.
        // this.board = [];    // Is an actual board needed? We can just make it that no coordinates are allowed > 9

        // const rowsAndColumnsCount = 10;
        // for (let i = 0; i < rowsAndColumnsCount; i++) {
        //     this.board[i] = [];
        //     for (let j = 0; j < rowsAndColumnsCount; j++) {
        //         this.board[i].push('O');
        //     }
        // }
    }

    placeShip(ship, bowXCoordinate, bowYCoordinate, orientation) {
        // North - Bow is at top, rest follows downwards
        // South - Bow is at bottom, rest follows upwards
        // East - Bow is at right, rest follows left
        // West - Bow is at left, rest follows right
        
        if (bowXCoordinate > 9 || bowXCoordinate < 0 || bowYCoordinate > 9 || bowYCoordinate < 0) throw new Error('Coordinates are outside gameboard range.');
        
        const coordinatesSet = new Set();   // Doing this here instead of initializing set in Ship class constructor so that "ship.coordinates = coordinatesSet;" line keep things clean. It's overriding so we don't just always have ship.coordinates be the same reference everytime in our Jest test because it causes it to fail because everytime we place the same ship one after another it's just making a longer and longer (and wrong) set
        coordinatesSet.add(`${bowXCoordinate},${bowYCoordinate}`);
        let nextYCoordinate = bowYCoordinate;   // These aren't technically necessary. We could just increment the bow coordinates within the for loop. But then it's a bit unclear because they'd no longer be the coordinates of the bow.
        let nextXCoordinate = bowXCoordinate;

        switch (orientation) {
            case 'north':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextYCoordinate++;
                    if (nextYCoordinate > 9) throw new Error('Coordinates are outside gameboard range.');
                    coordinatesSet.add(`${bowXCoordinate},${nextYCoordinate}`);
                }
                break;

            case 'south':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextYCoordinate--;
                    if (nextYCoordinate < 0) throw new Error('Coordinates are outside gameboard range.');
                    coordinatesSet.add(`${bowXCoordinate},${nextYCoordinate}`);
                }
                break;

            case 'east':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextXCoordinate--;
                    if (nextXCoordinate < 0) throw new Error('Coordinates are outside gameboard range.');
                    coordinatesSet.add(`${nextXCoordinate},${bowYCoordinate}`);
                }
                break;

            case 'west':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextXCoordinate++;
                    if (nextXCoordinate > 9) throw new Error('Coordinates are outside gameboard range.');
                    coordinatesSet.add(`${nextXCoordinate},${bowYCoordinate}`);
                }
                break;
        }
        ship.coordinates = coordinatesSet;
    }

    receiveAttack(xCoordinate, yCoordinate) {
        // Include hits, misses, and if all ship sunk
        // Check if hitTracker Set already has the coordinates and throw Error
        // Check if any of the ships coordinate sets have the new hit coordinates obj
        this.hitTracker.add(`${xCoordinate},${yCoordinate}`);
    }
}

const gameboard = new Gameboard();
export { gameboard };
