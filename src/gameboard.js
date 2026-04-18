import { fleet } from "./ship.js";

class Gameboard {
    constructor() {
        this.hitTracker = new Set();
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
        
        ship.coordinates.add(`${bowXCoordinate},${bowYCoordinate}`);
        let nextYCoordinate = bowYCoordinate;   // These aren't technically necessary. We could just increment the bow coordinates within the for loop. But then it's a bit unclear because they'd no longer be the coordinates of the bow.
        let nextXCoordinate = bowXCoordinate;

        switch (orientation) {
            case 'north':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextYCoordinate++;
                    if (nextYCoordinate > 9) throw new Error('Coordinates are outside gameboard range.');
                    ship.coordinates.add(`${bowXCoordinate},${nextYCoordinate}`);
                }
                break;

            case 'south':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextYCoordinate--;
                    if (nextYCoordinate < 0) throw new Error('Coordinates are outside gameboard range.');
                    ship.coordinates.add(`${bowXCoordinate},${nextYCoordinate}`);
                }
                break;

            case 'east':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextXCoordinate--;
                    if (nextXCoordinate < 0) throw new Error('Coordinates are outside gameboard range.');
                    ship.coordinates.add(`${nextXCoordinate},${bowYCoordinate}`);
                }
                break;

            case 'west':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextXCoordinate++;
                    if (nextXCoordinate > 9) throw new Error('Coordinates are outside gameboard range.');
                    ship.coordinates.add(`${nextXCoordinate},${bowYCoordinate}`);
                }
                break;
        }
    }

    receiveAttack(xCoordinate, yCoordinate, fleetParam = fleet) {
        const hitCoordinates = `${xCoordinate},${yCoordinate}`;
        if (this.hitTracker.has(hitCoordinates)) throw new Error('Coordinate already hit. Try Again.');
        this.hitTracker.add(hitCoordinates);

        const hitData = this.#hitChecker(hitCoordinates);
        this.#displayMessage(hitData);
    }
        
    #hitChecker(hitCoordinates) {
        const hitData = {
            'shipHit': false,
            'shipSunk': false,
        }

        for (let ship in fleet) {
            if (fleet[ship].coordinates.has(hitCoordinates)) {
                fleet[ship].hitCount++;
                hitData.shipHit = true;

                if (fleet[ship].hitCount === fleet[ship].length) {
                    fleet[ship].hitStatus = true;
                    hitData.shipSunk = true;
                }
            }
            break;
        }
        return hitData;
    }

    #displayMessage(hitData) {
        if (hitData.shipHit) console.log(`${fleet[ship]} has been hit!`);
        if (hitData.shipSunk) console.log(`${fleet[ship]} has been sunk!`);
        else console.log('You missed!');
    }
}

const gameboard = new Gameboard();
export { gameboard };

