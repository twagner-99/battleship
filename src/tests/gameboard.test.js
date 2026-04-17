import { gameboard } from "../gameboard";
import { fleet } from "../ship.js";

test('throws an error if bow coordinates are out of range of gameboard size', () => {
    expect(() => {
        gameboard.placeShip(fleet.carrier, 10, 0, 'north');
    }).toThrow('Coordinates are outside gameboard range.');

    expect(() => {
        gameboard.placeShip(fleet.carrier, 0, 10, 'north');
    }).toThrow('Coordinates are outside gameboard range.');

    expect(() => {
        gameboard.placeShip(fleet.carrier, -1, 0, 'north');
    }).toThrow('Coordinates are outside gameboard range.');

    expect(() => {
        gameboard.placeShip(fleet.carrier, 0, -1, 'north');
    }).toThrow('Coordinates are outside gameboard range.');
})

test('throws an error if calculated coordinates are out of range of gameboard size', () => {
    expect(() => {
        gameboard.placeShip(fleet.carrier, 9, 9, 'north');
    }).toThrow('Coordinates are outside gameboard range.');

    expect(() => {
        gameboard.placeShip(fleet.carrier, 0, 0, 'south');
    }).toThrow('Coordinates are outside gameboard range.');

    expect(() => {
        gameboard.placeShip(fleet.carrier, 1, 7, 'east');
    }).toThrow('Coordinates are outside gameboard range.');

    expect(() => {
        gameboard.placeShip(fleet.carrier, 8, 2, 'west');
    }).toThrow('Coordinates are outside gameboard range.');
})

test('places ship with orientation of north', () => {
    gameboard.placeShip(fleet.patrolBoat, 0, 0, 'north');
    let coordinateSet = fleet.patrolBoat.coordinates;
    expect([...coordinateSet]).toStrictEqual(['0,0', '0,1']);

    gameboard.placeShip(fleet.destroyer, 2, 3, 'north');
    coordinateSet = fleet.destroyer.coordinates;
    expect([...coordinateSet]).toStrictEqual(['2,3', '2,4', '2,5']);
})

test('places ship with orientation of south', () => {
    gameboard.placeShip(fleet.patrolBoat, 9, 9, 'south');
    let coordinateSet = fleet.patrolBoat.coordinates;
    expect([...coordinateSet]).toStrictEqual(['9,9', '9,8']);
})

test('places ship with orientation of east', () => {
    gameboard.placeShip(fleet.patrolBoat, 8, 2, 'east');
    let coordinateSet = fleet.patrolBoat.coordinates;
    expect([...coordinateSet]).toStrictEqual(['8,2', '7,2']);
})

test('places ship with orientation of west', () => {
    gameboard.placeShip(fleet.patrolBoat, 4, 7, 'west');
    let coordinateSet = fleet.patrolBoat.coordinates;
    expect([...coordinateSet]).toStrictEqual(['4,7', '5,7']);
})