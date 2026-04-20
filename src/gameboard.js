import { fleet } from "./ship.js";

class Gameboard {
    constructor() {
        this.hitTracker = new Set();
    }

    // Add an Error if an incorrect orientation is passed in?
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

        const hitData = this.#hitChecker(hitCoordinates, fleetParam);
        this.#displayMessage(hitData);
    }
        
    #hitChecker(hitCoordinates, fleetParam) {
        const hitData = {
            'shipHit': false,
            'shipSunk': false,
            'shipType': undefined,
        }

        for (let ship in fleetParam) {
            if (fleetParam[ship].coordinates.has(hitCoordinates)) {
                fleetParam[ship].hitCount++;
                hitData.shipHit = true;
                hitData.shipType = ship;

                if (fleetParam[ship].hitCount === fleetParam[ship].shipLength) {
                    fleetParam[ship].sunkStatus = true;
                    hitData.shipSunk = true;
                }
            }
            if (hitData.shipHit) break; // So we don't get stuck in the for...in loop longer than we need to be
        }
        return hitData;
    }

    #displayMessage(hitData) {
        let message = 'You missed!';
        if (hitData.shipSunk) message = `${hitData.shipType} has been sunk!`;
        else if (hitData.shipHit) message = `${hitData.shipType} has been hit!`;
        
        console.log(message);
    }
}

// Will prob want to do this in the file that controls new games. Create a new gameboard for each game. Not here.
// const gameboard = new Gameboard();  
export { Gameboard };

