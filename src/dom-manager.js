import { Ship } from "./ship.js";
import { Gameboard } from "./gameboard.js";
import { createPlayer, getPlayers } from "./players.js";

// On page load, open New Game modal

// const newGameDiaglog = 
// document.querySelector('#new-game-dialog').openModal();

// When New Game Btn is clicked, 
    // close new game modal and open New Player modal
// When new player submit btn is clicked
    // create players, create gamboards, close new player modal
// Need an interface to place ships
    // Can only see player board, place ships one by one (with ability to change orientation), confirm when done
// When confirm is clicked, now user can see player gameboard (with their ships) and computer gameboard where they will click


// Use composition over inheritance here to create buttons?

// If we btns that do the same exact thing, like multiple 
    // That submit data or something, we should use data attributes
    // and we'll have to create another function or create a separate obj
    // Like submitBtns = {} or something

// This code does not have any dynamically created buttons or items
    // so we can just make getBtns and getDialogs as IIFEs one time (jk, uneccesaryily confusing)
    // Because there's nothing dynamically created, we don't NEED to capture
        // event bubbling, and there's not a million buttons, so I am just
        // going to add the even listeners directly to the element instead of a parent



// Once you have all you functions, consider IIFEs to organize if you need
// to export a bunch. Then you can just export the function result instead
// a bunch of individial functions
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
    createPlaceShipUI();    // Needs to go AFTER .showModal, otherwise it is not shown
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
// Need to move the gameboard bag to it's og place after ships are added
    const gameboardPlayer1 = document.querySelector('.gameboard.player1');
    dialogs['place-ships-dialog'].appendChild(gameboardPlayer1);
    
}

function placeShipUIController() {
    // Please place your batlleship.. wait for user to place it
    //When you place shiponclick, it'll go to next ship
    // Cheater way is to have placeship1, placeship2, placeship3 functions.
    // for each ship, wait until user placeshiponclick

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

// on mouseenter a div, do this. then untoggle the class mouseleave
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
                    // if (nextYCoordinate > 9) throw new Error('Coordinates are outside gameboard range.');
                    calculatedHoverCoordinates.push(`${bowXCoordinate},${nextYCoordinate}`);
                }
                break;

            case 'south':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextYCoordinate--;
                    // if (nextYCoordinate < 0) throw new Error('Coordinates are outside gameboard range.');
                    ship.coordinates.push(`${bowXCoordinate},${nextYCoordinate}`);
                }
                break;

            case 'east':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextXCoordinate--;
                    // if (nextXCoordinate < 0) throw new Error('Coordinates are outside gameboard range.');
                    ship.coordinates.push(`${nextXCoordinate},${bowYCoordinate}`);
                }
                break;

            case 'west':
                for (let i = 1; i < ship.shipLength; i++) {
                    nextXCoordinate++;
                    // if (nextXCoordinate > 9) throw new Error('Coordinates are outside gameboard range.');
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




//on click, place ship function
//then read that function to drive DOM update

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

// Make this an actual function
    // Takes btn object (default?), and whatever function you want
    // Would be better in theory, but honestly harder to follow espeically with such a small app
    // It would just add a llyer of uneeded abstraction without a lot of beneft 
function addClickEvents() {
    btns['new-game-btn'].addEventListener('click', newGameHandler);
    btns['create-player-btn'].addEventListener('click', newPlayerHandler);
    btns['cancel-create-player-btn'].addEventListener('click', () => dialogs['new-player-dialog'].close());
}

export { initialPageSetup, addClickEvents };