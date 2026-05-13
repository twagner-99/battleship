import { Ship } from "./ship";

class Gameboard {
    constructor() {
        this.hitTracker = new Set();
        this.numShipsSunk = 0;
        this.fleet = {
            'carrier': new Ship(5),
            'battleship': new Ship(4),
            'destroyer': new Ship(3),
            'submarine': new Ship(3),
            'patrolBoat': new Ship(2),
        }
    }

    // For player's own board
    // Need a fail safe so you can't place ships where another one already is
    placeShip(ship, bowXCoordinate, bowYCoordinate, orientation) {
        // North - Bow is at top, rest follows downwards
        // South - Bow is at bottom, rest follows upwards
        // East - Bow is at right, rest follows left
        // West - Bow is at left, rest follows right
        
        if (bowXCoordinate > 9 || bowXCoordinate < 0 || bowYCoordinate > 9 || bowYCoordinate < 0) throw new Error('Coordinates are outside gameboard range.');
        
        const coordinateArr = [`${bowXCoordinate}${bowYCoordinate}`];
        let nextXCoordinate = bowXCoordinate;
        let nextYCoordinate = bowYCoordinate;

        switch (orientation) {
            case 'north':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextYCoordinate++;
                    if (nextYCoordinate > 9) throw new Error('Coordinates are outside gameboard range.');
                    coordinateArr.push(`${bowXCoordinate}${nextYCoordinate}`);
                }
                // Only add coordinates to ship.coordinates if no error is thrown.
                // Prevents previous issue where when you click to place ship and some calculated coordinates
                // are out of range, the ones that were still in range were added to ship.coordinates.
                // This only adds coordinates when everything in the calculated coordinates is legal
                ship.coordinates = new Set(coordinateArr);
                break;

            case 'south':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextYCoordinate--;
                    if (nextYCoordinate < 0) throw new Error('Coordinates are outside gameboard range.');
                    coordinateArr.push(`${bowXCoordinate}${nextYCoordinate}`);
                }
                ship.coordinates = new Set(coordinateArr);
                break;

            case 'east':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextXCoordinate--;
                    if (nextXCoordinate < 0) throw new Error('Coordinates are outside gameboard range.');
                    coordinateArr.push(`${nextXCoordinate}${bowYCoordinate}`);
                }
                ship.coordinates = new Set(coordinateArr);
                break;

            case 'west':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextXCoordinate++;
                    if (nextXCoordinate > 9) throw new Error('Coordinates are outside gameboard range.');
                    coordinateArr.push(`${nextXCoordinate}${bowYCoordinate}`);
                }
                ship.coordinates = new Set(coordinateArr);
                break;
            default:
                throw new Error('Orientation must be a cardinal direction (north, south, east, or west).');
        }
    }

    receiveAttack(xCoordinate, yCoordinate, fleetParam = this.fleet) {
        const hitCoordinates = `${xCoordinate}${yCoordinate}`;

        // Don't want to throw an error
        // Need a message for the user to try again.
        // Need to manage this so if this happens, player isn't toggled in dom-mananger.js
        if (this.hitTracker.has(hitCoordinates)) throw new Error('Coordinate already hit. Try Again.');
        this.hitTracker.add(hitCoordinates);

        return this.#hitChecker(hitCoordinates, fleetParam);
    }
        
    #hitChecker(hitCoordinates, fleetParam) {
        const hitData = {
            'shipHit': false,
            'shipSunk': false,
            'shipType': undefined,
        }

        for (let ship in fleetParam) {
            if (fleetParam[ship].coordinates.has(hitCoordinates)) {
                fleetParam[ship].hit();
                hitData.shipHit = true;
                hitData.shipType = ship;

                if (fleetParam[ship].isSunk()) {
                    hitData.shipSunk = true;
                    this.numShipsSunk++;
                }
            }
            if (hitData.shipHit) break; // So we don't get stuck in the for...in loop longer than we need to be
        }
        return hitData;
    }
}

export { Gameboard };

