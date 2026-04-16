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
    expect(fleet.patrolBoat.coordinates).toStrictEqual([{'x': 0, 'y': 0}, {'x': 0, 'y': 1}]);

    gameboard.placeShip(fleet.destroyer, 2, 3, 'north');
    expect(fleet.destroyer.coordinates).toStrictEqual([{'x': 2, 'y': 3}, {'x': 2, 'y': 4}, {'x': 2, 'y': 5}]);
})

test('places ship with orientation of south', () => {
    gameboard.placeShip(fleet.patrolBoat, 9, 9, 'south');
    expect(fleet.patrolBoat.coordinates).toStrictEqual([{'x': 9, 'y': 9}, {'x': 9, 'y': 8}]);
})

test('places ship with orientation of east', () => {
    gameboard.placeShip(fleet.patrolBoat, 8, 2, 'east');
    expect(fleet.patrolBoat.coordinates).toStrictEqual([{'x': 8, 'y': 2}, {'x': 7, 'y': 2}]);
})

test('places ship with orientation of west', () => {
    gameboard.placeShip(fleet.patrolBoat, 4, 7, 'west');
    expect(fleet.patrolBoat.coordinates).toStrictEqual([{'x': 4, 'y': 7}, {'x': 5, 'y': 7}]);
})