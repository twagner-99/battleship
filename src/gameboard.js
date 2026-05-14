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

    // Need a fail safe so you can't place ships where another one already is

    #legalPlacementChecker(orientation, fleetParam = this.fleet) {

    }

    placeShip(ship, bowXCoordinate, bowYCoordinate, orientation) {
        // Vertical - Bow is at top, rest follows downwards
        // Horizontal - Bow is at left, rest follows right
        
        if (bowXCoordinate > 9 || bowXCoordinate < 0 || bowYCoordinate > 9 || bowYCoordinate < 0) throw new Error('Coordinates are outside gameboard range.');
        
        const coordinateArr = [`${bowXCoordinate}${bowYCoordinate}`];
        let nextXCoordinate = bowXCoordinate;
        let nextYCoordinate = bowYCoordinate;

        switch (orientation) {
            case 'vertical':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextYCoordinate++;
                    if (nextYCoordinate > 9) throw new Error('Coordinates are outside gameboard range.');
                    coordinateArr.push(`${bowXCoordinate}${nextYCoordinate}`);
                }
                ship.coordinates = new Set(coordinateArr);
                break;

            case 'horizontal':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextXCoordinate++;
                    if (nextXCoordinate > 9) throw new Error('Coordinates are outside gameboard range.');
                    coordinateArr.push(`${nextXCoordinate}${bowYCoordinate}`);
                }
                ship.coordinates = new Set(coordinateArr);
                break;
            default:
                throw new Error('Orientation must be horizontal or vertical.');
        }
    }

    receiveAttack(xCoordinate, yCoordinate, fleetParam = this.fleet) {
        const hitCoordinates = `${xCoordinate}${yCoordinate}`;
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

