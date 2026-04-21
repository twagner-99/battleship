import { Gameboard } from "../gameboard";
import { Ship } from "../ship";


let gameboardMock;
beforeEach(() => {
    gameboardMock = new Gameboard();
})

let fleetMock;
beforeEach(() => {
    fleetMock = {
        'carrier': new Ship(5),
        'battleship': new Ship(4),
        'destroyer': new Ship(3),
        'submarine': new Ship(3),
        'patrolBoat': new Ship(2),
    }   
})

test('throws an error if orientation is not a cardinal direction', () => {
    expect(() => {
        gameboardMock.placeShip(fleetMock.carrier, 0, 0, 'weast');
    }).toThrow('Orientation must be a cardinal direction (north, south, east, or west).');
})

test('throws an error if bow coordinates are out of range of gameboard size', () => {
    expect(() => {
        gameboardMock.placeShip(fleetMock.carrier, 10, 0, 'north');
    }).toThrow('Coordinates are outside gameboard range.');

    expect(() => {
        gameboardMock.placeShip(fleetMock.carrier, 0, 10, 'north');
    }).toThrow('Coordinates are outside gameboard range.');

    expect(() => {
        gameboardMock.placeShip(fleetMock.carrier, -1, 0, 'north');
    }).toThrow('Coordinates are outside gameboard range.');

    expect(() => {
        gameboardMock.placeShip(fleetMock.carrier, 0, -1, 'north');
    }).toThrow('Coordinates are outside gameboard range.');
})

test('throws an error if calculated coordinates are out of range of gameboard size', () => {
    expect(() => {
        gameboardMock.placeShip(fleetMock.carrier, 9, 9, 'north');
    }).toThrow('Coordinates are outside gameboard range.');

    expect(() => {
        gameboardMock.placeShip(fleetMock.carrier, 0, 0, 'south');
    }).toThrow('Coordinates are outside gameboard range.');

    expect(() => {
        gameboardMock.placeShip(fleetMock.carrier, 1, 7, 'east');
    }).toThrow('Coordinates are outside gameboard range.');

    expect(() => {
        gameboardMock.placeShip(fleetMock.carrier, 8, 2, 'west');
    }).toThrow('Coordinates are outside gameboard range.');
})

test('places ship with orientation of north', () => {
    gameboardMock.placeShip(fleetMock.patrolBoat, 0, 0, 'north');
    let coordinateSet = fleetMock.patrolBoat.coordinates;
    expect([...coordinateSet]).toStrictEqual(['0,0', '0,1']);

    gameboardMock.placeShip(fleetMock.destroyer, 2, 3, 'north');
    coordinateSet = fleetMock.destroyer.coordinates;
    expect([...coordinateSet]).toStrictEqual(['2,3', '2,4', '2,5']);
})

test('places ship with orientation of south', () => {
    gameboardMock.placeShip(fleetMock.patrolBoat, 9, 9, 'south');
    let coordinateSet = fleetMock.patrolBoat.coordinates;
    expect([...coordinateSet]).toStrictEqual(['9,9', '9,8']);
})

test('places ship with orientation of east', () => {
    gameboardMock.placeShip(fleetMock.patrolBoat, 8, 2, 'east');
    let coordinateSet = fleetMock.patrolBoat.coordinates;
    expect([...coordinateSet]).toStrictEqual(['8,2', '7,2']);
})

test('places ship with orientation of west', () => {
    gameboardMock.placeShip(fleetMock.patrolBoat, 4, 7, 'west');
    let coordinateSet = fleetMock.patrolBoat.coordinates;
    expect([...coordinateSet]).toStrictEqual(['4,7', '5,7']);
})

test('throws an Error if user tries to hit a previously hit tile', () => {
    gameboardMock.hitTracker.add('8,2');
    expect(() => {
        gameboardMock.receiveAttack(8, 2);
    }).toThrow('Coordinate already hit. Try Again.');
})

test('if a ship has been hit, log message to user', () => {
    fleetMock.destroyer.coordinates.add('2,3').add('2,4').add('2,5');

    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    gameboardMock.receiveAttack(2, 4, fleetMock);
    expect(spy).toHaveBeenCalledWith(`destroyer has been hit!`);
})

test('if a ship has been sunk, log message to user', () => {
    fleetMock.destroyer.coordinates.add('2,3').add('2,4').add('2,5');
    fleetMock.destroyer.hit();
    fleetMock.destroyer.hit();

    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    gameboardMock.receiveAttack(2, 4, fleetMock);
    expect(spy).toHaveBeenCalledWith(`destroyer has been sunk!`);
})

test('if ship is missed, log message to user', () => {
    gameboardMock.receiveAttack(9, 4, fleetMock);
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

    expect(spy).toHaveBeenCalledWith('You missed!');
})

test('if all ships are sunk, log message to user', () => {
    fleetMock.destroyer.coordinates.add('2,3').add('2,4').add('2,5');
    fleetMock.destroyer.hit();
    fleetMock.destroyer.hit();
    gameboardMock.numShipsSunk = Object.keys(fleetMock).length - 1;
   
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    gameboardMock.receiveAttack(2, 4, fleetMock);

    expect(spy).toHaveBeenCalledWith(`All ships have been sunk!`);
})