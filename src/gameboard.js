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

    #legalPlacementChecker(placeShipCoordinatesArr, fleetParam = this.fleet) {
        // // No shipCoordinates of ship being placed allowed to be out of range
        // for (let coordinate of placeShipCoordinatesArr){
        //     const xCoord = Number(coordinate[0]);
        //     const yCoord = Number(coordinate[1]);

        //     // MOVE THIS BACK TO PLACESHIP
        //     if (xCoord > 9 || yCoord > 9 || xCoord < 0 || yCoord < 0) {
        //         throw new Error('Coordinates are outside gameboard range.');
        //     }
        // }

        // No shipCoordinates of ship being placed allowed to overlap with already placed ships
        for (let ship in fleetParam) {
            for (let coordinate of placeShipCoordinatesArr) {
                if (fleetParam[ship].shipCoordinates.has(coordinate)) throw new Error('Space already occupied.');
            }
        }

        // No shipCoordinates of ship being placed allowed to overlap with already placed ship bufferCoordinates
        for (let ship in fleetParam) {
            for (let coordinate of placeShipCoordinatesArr) {
                if (fleetParam[ship].bufferCoordinates.has(coordinate)) throw new Error('Ships cannot be placed directly adjacent to each other.');
            }
        }
        return true;
    }

    #calculateBufferCoordinates(placeShipCoordinatesArr) {
        const bufferCoordinatesArr = [];
        for (let coordinate of placeShipCoordinatesArr) {
            let xCoord = Number(coordinate[0]);
            let yCoord = Number(coordinate[1]);

            for (let i = 0; i < 8; i++) {
                if (i === 0) {
                    xCoord++;
                    bufferCoordinatesArr.push(`${xCoord}${yCoord}`);
                }

                else if (i === 1) {
                    yCoord++;
                    bufferCoordinatesArr.push(`${xCoord}${yCoord}`);
                }

                else if (i === 2 || i === 3) {
                    xCoord--;
                    bufferCoordinatesArr.push(`${xCoord}${yCoord}`);
                }

                else if (i === 4 || i === 5) {
                    yCoord--;
                    bufferCoordinatesArr.push(`${xCoord}${yCoord}`);
                }

                else {
                    xCoord++;
                    bufferCoordinatesArr.push(`${xCoord}${yCoord}`);
                }
            }
        }
        return bufferCoordinatesArr;

        // works for any orientation

            // x + 1, y + 0 //
            // x + 0, y + 1 //
            // x - 1, y + 0 //
            // x - 1, y + 0 //
            // x + 0, y - 1 //
            // x + 0, y - 1 //
            // x + 1, y + 0 //
            // x + 1, y + 0 //
    }

    #calculatePlaceShipCoordinates(ship, bowXCoordinate, bowYCoordinate, orientation) {
        // Vertical - Bow is at top, rest follows downwards
        // Horizontal - Bow is at left, rest follows right
        const placeShipCoordinatesArr = [`${bowXCoordinate}${bowYCoordinate}`];
        let nextXCoordinate = bowXCoordinate;
        let nextYCoordinate = bowYCoordinate;

        if (bowXCoordinate > 9 || bowYCoordinate > 9 || bowXCoordinate < 0 || bowYCoordinate < 0) {
            throw new Error('Coordinates are outside gameboard range.');
        }

        switch (orientation) {
            case 'vertical':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextYCoordinate++;
                    if (nextYCoordinate > 9) throw new Error('Coordinates are outside gameboard range.');
                    placeShipCoordinatesArr.push(`${bowXCoordinate}${nextYCoordinate}`);
                }
                break;

            case 'horizontal':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextXCoordinate++;
                    if (nextXCoordinate > 9) throw new Error('Coordinates are outside gameboard range.');
                    placeShipCoordinatesArr.push(`${nextXCoordinate}${bowYCoordinate}`);
                }
                break;
            default:
                throw new Error('Orientation must be horizontal or vertical.');
        }

        return placeShipCoordinatesArr;
    }

    placeShip(ship, bowXCoordinate, bowYCoordinate, orientation) {
        const placeShipCoordinatesArr = this.#calculatePlaceShipCoordinates(ship, bowXCoordinate, bowYCoordinate, orientation);
        const bufferCoordinates = this.#calculateBufferCoordinates(placeShipCoordinatesArr);
        
        if (this.#legalPlacementChecker(placeShipCoordinatesArr)) {
            ship.shipCoordinates = new Set(placeShipCoordinatesArr);
            ship.bufferCoordinates = new Set(bufferCoordinates);
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
            if (fleetParam[ship].shipCoordinates.has(hitCoordinates)) {
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

