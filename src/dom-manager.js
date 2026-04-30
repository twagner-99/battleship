import { Ship } from "./ship.js";
import { Gameboard } from "./gameboard.js";
import { createPlayer, getPlayers } from "./players.js";

// On page load:
    // open New Game modal
// When New Game Btn is clicked:
    // close new game modal and open New Player modal
// When new player submit btn is clicked:
    // create players, create gamboards, close new player modal, open placeShip modal
// In placeShip modal:
    // Can only see player board
    // Hovering over grid squares shows current ship
    // There is a button to change orientation
    // On grid square click, placeShip()
// After all ships placed:
    // User can see player gameboard (with their ships) and computer gameboard where they will click to attack

// If there are multiple btns that do the same exact thing:
    // Use data attributes
    // Get all of those btns that do the same thing and add eventListener

// This code does not have any dynamically created buttons
    // So we don't NEED to capture event bubbling.
    // And since there's not a million buttons, 
        // I am just adding the eventListeners directly to the element instead of a parent

// Once you have all you functions, consider IIFEs to organize if you need
// to export a bunch. Then you can just export the function result instead
// a bunch of individual functions

function getBtns() {
    const btnsArr = document.querySelectorAll('button');
    const btnsObj = {};

    for (let btn of btnsArr) {
        btnsObj[btn.id] = btn;
    }

    return btnsObj;
}

function getDialogs() {
    const diaArr = document.querySelectorAll('dialog');
    const diaObj = {};

    for (let dia of diaArr) {
        diaObj[dia.id] = dia;
    }

    return diaObj;
}

const dialogs = getDialogs();
const btns = getBtns();

function initialPageSetup() {
    document.querySelector('#new-game-dialog').showModal();
    createGameboardGridDivs();
    addClickEvents();
    createPlaceShipUI(); // Needs to go AFTER .showModal, otherwise it is not shown
}

function createGameboardGridDivs(numGridSquares = 100) {
    const gameboards = document.querySelectorAll('.gameboard');

    for (let gameboard of gameboards) {
        let x = 0;
        let y = 0;
        for (let i = 0; i < numGridSquares; i++) {
            const gridSquare = document.createElement('div');
            gridSquare.id = `${x}${y}`;
            // gridSquare.addEventListener('click', )
            gameboard.appendChild(gridSquare);
            x++;

            if (x > 9) {
                x = 0;
                y++;
            }
        }
    }
}

function gameboardGridHandler() {
    // Put an X if ship, a dot if empty. 
}

function createPlaceShipUI() {
// Need to move the gameboard back to it's original location after ships are added
    const gameboardPlayer1 = document.querySelector('.gameboard.player1');
    dialogs['place-ships-dialog'].appendChild(gameboardPlayer1);
    
}

// On gridSquare click, run placeShip(); to place first ship in fleet
    // then read that function to drive DOM update
    // then update ship to be the next ship.

function placeShipUIController() {
    // Two ways to do this (and a cheater way)
    // 1 - Use async code
        // Prompt user to place first ship in fleet
        // Wait until they place it
        // Update to next ship in fleet and prompt again until all ships placed
    // 2 - Sync code, but with interface to click on the ship to be placed
        // User can see the list of ships, each with corresponding id to their name in fleet
        // On click of one of the ships, set currentShip to be the clicked ship
            // and pass currentShip into placeShip() on gridSquare click.
    // 3 - Cheater way (or is it?)
        // This could be callback hell
        // Have placeship1, placeship2, placeship3 functions that prompt user to place the ship 
            // Subequent placeship functions would have to be callbacks to the first one
            // placeship1 (callback = placeship2)
                // do stuff
                // add event listener(click, placeship() and placeship2) ... and keep going like that
}

// Implement drag ability later (will also allow user to change first placement)
// Also need fail safe so ships can't be placed on top of each other
// And a fail safe so ships can't be placed in adjacent squares
function placeShipOnClick(e) {    
    const placeShipPara = document.querySelector('#place-ship-para');
    const player1 = getPlayers().player1;
    for (let ship in player1.gameboard.fleet) {
        placeShipPara.textContent = `Place your ${ship}`;
        const coordinates = e.target.id;
        const xCoord = coordinates[0];
        const yCoord = coordinates[1];
        const orientation = orientationHandler.getOrientation();
        player1.gameboard.placeShip(ship, xCoord, yCoord, orientation);
    }
}

// on mouseenter a gridSquare div, do this.
function placeShipHoverHandler(e) {
    const coordinates = e.target.id;
    const xCoord = coordinates[0];
    const yCoord = coordinates[1];
    const orientation = orientationHandler.getOrientation();

    // UPDATE SHIP ARG
    const hoveredElements = calculateHoveredElements(ship, xCoord, yCoord, orientation);
    toggleHoverElementStyle(hoveredElements);
    e.target.addEventListener('mouseleave', toggleHoverElementStyle);

    function calculateHoveredElements(ship, bowXCoordinate, bowYCoordinate, orientation) {
        const calculatedHoverCoordinates = [];
        calculatedHoverCoordinates.push(`${bowXCoordinate},${bowYCoordinate}`);
        let nextYCoordinate = bowYCoordinate;
        let nextXCoordinate = bowXCoordinate;

        switch (orientation) {
            case 'north':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextYCoordinate++;
                    calculatedHoverCoordinates.push(`${bowXCoordinate},${nextYCoordinate}`);
                }
                break;

            case 'south':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextYCoordinate--;
                    ship.coordinates.push(`${bowXCoordinate},${nextYCoordinate}`);
                }
                break;

            case 'east':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextXCoordinate--;
                    ship.coordinates.push(`${nextXCoordinate},${bowYCoordinate}`);
                }
                break;

            case 'west':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextXCoordinate++;
                    ship.coordinates.push(`${nextXCoordinate},${bowYCoordinate}`);
                }
                break;
        }

        return calculatedHoverCoordinates;
    }

    function toggleHoverElementStyle(coordinatesArr) {
        for (let coordinate of coordinatesArr) {
            const gridSquare = document.querySelector(`#${coordinate}`);
            gridSquare.classList.toggle('highlight');
        }
    }
}


const orientationHandler = (function() {
    const orientationBtn = document.querySelector('#orientation-btn');
    const orientationArr = ['north', 'east', 'south', 'west'];
    let counter = 0;
    let orientation;

    function getOrientation() {
        return orientation;
    }

    function toggleOrientation() {
        counter++;
        if (counter > 3) counter = 0;
        orientation = orientationArr[counter];
    }

    orientationBtn.addEventListener('click', toggleOrientation);

    return {
        getOrientation,
    }
})();



// add click event listeners to every grid.
// Need two modes for grid square clicks - place ship and attack

function removeAllChildren(parent) {
    while (parent.lastChild) parent.removeChild(parent.lastChild);
}

function newGameHandler() {
    dialogs['new-game-dialog'].close();
    dialogs['new-player-dialog'].showModal();
}

function newPlayerHandler() {
    const newPlayerInput = document.querySelector('#new-player-input');
    if (!newPlayerInput.reportValidity()) return;

    document.querySelector('#player1-name-para').textContent = newPlayerInput.value;
    document.querySelector('#player2-name-para').textContent = 'Computer';

    // When we have two players, will need to differentiate between the two player name inputs
    createPlayer('player1', newPlayerInput.value);
    createPlayer('player2', 'Computer');

    dialogs['new-player-dialog'].close();
    dialogs['place-ships-dialog'].showModal();
}


function placeShipUIHandler() {
    // I want a modal, with player gameboard.
}

function gridSquareHandler() {
    // On click, 
}

// I could make this an actual function that takes a btn and. a function to apply
    // Would be better in theory for open-closed, but in reality harder to follow.
    // This application is so small that it would just add another of unnecessary abstraction without a lot of benefit 
function addClickEvents() {
    btns['new-game-btn'].addEventListener('click', newGameHandler);
    btns['create-player-btn'].addEventListener('click', newPlayerHandler);
    btns['cancel-create-player-btn'].addEventListener('click', () => dialogs['new-player-dialog'].close());
}

export { initialPageSetup, addClickEvents };