import { gameboard } from "../gameboard";
import { fleet } from "../ship.js";

test('throws an error if bow coordinates are out of range of gameboard size', () => {
    expect(() => {
        gameboard.placeShip(fleet.carrier, 10, 0, 'north');
    }).toThrow(new Error('Coordinates are outside gameboard range.'))
})

// test('places ship with orientation of north', () => {
//     placeShip(fleet.carrier, 0, 0, 'north');
//     expect()
// })