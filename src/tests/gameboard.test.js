import { Gameboard } from "../gameboard";

let gameboard;
beforeEach(() => {
    gameboard = new Gameboard();
})

test('throws an error if bow coordinates are out of range of gameboard size', () => {
    const fleetMock = {
        'carrier': {
            "shipLength": 5,
            "coordinates": new Set(),
        }
    }

    expect(() => {
        gameboard.placeShip(fleetMock.carrier, 10, 0, 'north');
    }).toThrow('Coordinates are outside gameboard range.');

    expect(() => {
        gameboard.placeShip(fleetMock.carrier, 0, 10, 'north');
    }).toThrow('Coordinates are outside gameboard range.');

    expect(() => {
        gameboard.placeShip(fleetMock.carrier, -1, 0, 'north');
    }).toThrow('Coordinates are outside gameboard range.');

    expect(() => {
        gameboard.placeShip(fleetMock.carrier, 0, -1, 'north');
    }).toThrow('Coordinates are outside gameboard range.');
})

test('throws an error if calculated coordinates are out of range of gameboard size', () => {
    const fleetMock = {
        'carrier': {
            "shipLength": 5,
            "coordinates": new Set(),
        }
    }
    
    expect(() => {
        gameboard.placeShip(fleetMock.carrier, 9, 9, 'north');
    }).toThrow('Coordinates are outside gameboard range.');

    expect(() => {
        gameboard.placeShip(fleetMock.carrier, 0, 0, 'south');
    }).toThrow('Coordinates are outside gameboard range.');

    expect(() => {
        gameboard.placeShip(fleetMock.carrier, 1, 7, 'east');
    }).toThrow('Coordinates are outside gameboard range.');

    expect(() => {
        gameboard.placeShip(fleetMock.carrier, 8, 2, 'west');
    }).toThrow('Coordinates are outside gameboard range.');
})

test('places ship with orientation of north', () => {
    const fleetMock = {
        'patrolBoat': {
            "shipLength": 2,
            "coordinates": new Set(),
        },
        'destroyer': {
            "shipLength": 3,
            "coordinates": new Set(),
        }
    }
    
    gameboard.placeShip(fleetMock.patrolBoat, 0, 0, 'north');
    let coordinateSet = fleetMock.patrolBoat.coordinates;
    expect([...coordinateSet]).toStrictEqual(['0,0', '0,1']);

    gameboard.placeShip(fleetMock.destroyer, 2, 3, 'north');
    coordinateSet = fleetMock.destroyer.coordinates;
    expect([...coordinateSet]).toStrictEqual(['2,3', '2,4', '2,5']);
})

test('places ship with orientation of south', () => {
    const fleetMock = {
        'patrolBoat': {
            "shipLength": 2,
            "coordinates": new Set(),
        }
    }
    
    gameboard.placeShip(fleetMock.patrolBoat, 9, 9, 'south');
    let coordinateSet = fleetMock.patrolBoat.coordinates;
    expect([...coordinateSet]).toStrictEqual(['9,9', '9,8']);
})

test('places ship with orientation of east', () => {
    const fleetMock = {
        'patrolBoat': {
            "shipLength": 2,
            "coordinates": new Set(),
        }
    }

    gameboard.placeShip(fleetMock.patrolBoat, 8, 2, 'east');
    let coordinateSet = fleetMock.patrolBoat.coordinates;
    expect([...coordinateSet]).toStrictEqual(['8,2', '7,2']);
})

test('places ship with orientation of west', () => {
    const fleetMock = {
        'patrolBoat': {
            "shipLength": 2,
            "coordinates": new Set(),
        }
    }
    
    gameboard.placeShip(fleetMock.patrolBoat, 4, 7, 'west');
    let coordinateSet = fleetMock.patrolBoat.coordinates;
    expect([...coordinateSet]).toStrictEqual(['4,7', '5,7']);
})

test('throws an Error if user tries to hit a previously hit tile', () => {
    gameboard.hitTracker.add('8,2');
    expect(() => {
        gameboard.receiveAttack(8, 2);
    }).toThrow('Coordinate already hit. Try Again.');
})

test('if a ship has been hit, log message to user', () => {
    const fleetMock = {
        'patrolBoat': {
            "shipLength": 2,
            "coordinates": new Set(['0,0', '0,1']),
        },
        'destroyer': {
            "shipLength": 3,
            "coordinates": new Set(['2,3', '2,4', '2,5']),
        }
    }

    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    gameboard.receiveAttack(2, 4, fleetMock);

    expect(spy).toHaveBeenCalledWith(`destroyer has been hit!`);
})

test('if a ship has been sunk, log message to user', () => {
    const fleetMock = {
        'patrolBoat': {
            "shipLength": 2,
            "hitCount": 1,
            "coordinates": new Set(['0,0', '0,1']),
        },
        'destroyer': {
            "shipLength": 3,
            "hitCount": 2,
            "coordinates": new Set(['2,3', '2,4', '2,5']),
        }
    }

    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    gameboard.receiveAttack(2, 4, fleetMock);

    expect(spy).toHaveBeenCalledWith(`destroyer has been sunk!`);
})

test('if ship is missed, log message to user', () => {
    const fleetMock = {
        'patrolBoat': {
            "shipLength": 2,
            "hitCount": 1,
            "coordinates": new Set(['0,0', '0,1']),
        },
        'destroyer': {
            "shipLength": 3,
            "hitCount": 2,
            "coordinates": new Set(['2,3', '2,4', '2,5']),
        }
    }

    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    gameboard.receiveAttack(9, 4, fleetMock);

    expect(spy).toHaveBeenCalledWith('You missed!');
})