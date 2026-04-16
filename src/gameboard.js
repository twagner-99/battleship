class Gameboard {
    constructor() {
        // Could be a good candidate for a set b/c we can't have duplicates
        this.hitTracker = [];   // Will track if a spot has already been hit
        this.board = [];    // Is an actual board needed? We can just make it that no coordinates are allowed > 9

        const rowsAndColumnsCount = 10;
        for (let i = 0; i < rowsAndColumnsCount; i++) {
            this.board[i] = [];
            for (let j = 0; j < rowsAndColumnsCount; j++) {
                this.board[i].push('O');
            }
        }
    }

    placeShip(ship, bowXCoordinate, bowYCoordinate, orientation) {
        // North - Bow is at top, rest follows downwards
        // South - Bow is at bottom, rest follows upwards
        // East - Bow is at right, rest follows left
        // West - Bow is at left, rest follows right
        
        if (bowXCoordinate > 9 || bowXCoordinate < 0 || bowYCoordinate > 9 || bowYCoordinate < 0) throw new Error('Coordinates are outside gameboard range.');
        
        const coordinatesArr = [{'x': bowXCoordinate, 'y': bowYCoordinate}];
        let nextYCoordinate = bowYCoordinate;
        let nextXCoordinate = bowXCoordinate;

        switch (orientation) {
            case 'north':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextYCoordinate++;
                    if (nextYCoordinate > 9) throw new Error('Coordinates are outside gameboard range.');
                    coordinatesArr.push({'x': bowXCoordinate, 'y': nextYCoordinate});
                }
                break;

            case 'south':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextYCoordinate--;
                    if (nextYCoordinate < 0) throw new Error('Coordinates are outside gameboard range.');
                    coordinatesArr.push({'x': bowXCoordinate, 'y': nextYCoordinate});
                }
                break;

            case 'east':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextXCoordinate--;
                    if (nextXCoordinate < 0) throw new Error('Coordinates are outside gameboard range.');
                    coordinatesArr.push({'x': nextXCoordinate, 'y': bowYCoordinate});
                }
                break;

            case 'west':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextXCoordinate++;
                    if (nextXCoordinate > 9) throw new Error('Coordinates are outside gameboard range.');
                    coordinatesArr.push({'x': nextXCoordinate, 'y': bowYCoordinate});
                }
                break;
        }
        ship.coordinates = coordinatesArr;
    }

    receiveAttack(coordinates) {
        // Include hits, misses, and if all ship sunk
   
    }
}

const gameboard = new Gameboard();
export { gameboard };

const stats = { score: 0 };
stats.score++; 
// This is allowed because 'stats' is still
// pointing to the same object
