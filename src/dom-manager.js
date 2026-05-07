import { Ship } from "./ship.js";
import { Gameboard } from "./gameboard.js";
import { updatePlayerName, getPlayers } from "./players.js";

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

// Can make IIFEs 
const dialogs = getDialogs();
const btns = getBtns();

function initialPageSetup() {
    // Might want a function here that clears everything first for new games.
    document.querySelector('#new-game-dialog').showModal();
    createGameboard();
    addClickEvents();
}

function createGameboard(numGridSquares = 100) {
    const gameboards = document.querySelectorAll('.gameboard');
    
    for (let gameboard of gameboards) {
        let xCoord = 0;
        let yCoord = 0;
        for (let i = 0; i < numGridSquares; i++) {
            const gridSquare = document.createElement('div');
            gridSquare.id = `${xCoord}${yCoord}`;
            gameboard.appendChild(gridSquare);
            xCoord++;
            
            if (xCoord > 9) {
                xCoord = 0;
                yCoord++;
            }
        }
    }
}

function addClickEvents() {
    btns['new-game-btn'].addEventListener('click', newGameHandler);
    btns['create-player-btn'].addEventListener('click', newPlayerHandler);
    btns['cancel-create-player-btn'].addEventListener('click', () => dialogs['new-player-dialog'].close());
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
    updatePlayerName('player1', newPlayerInput.value);
    updatePlayerName('player2', 'Computer');
    
    dialogs['new-player-dialog'].close();
    placeShipUISetup()
}

function gameboardGridHandler() {
    // Put an X if ship, a dot if empty. 
}

// Needs to be updated when player2 functionality is added
function createPlaceShipUI() {
    const gameboardPlayer1 = document.querySelector('.gameboard.player1');  
    const player1GameboardGridSquares = document.querySelectorAll('.gameboard.player1 div');

    showWhatShipToPlace();

    for (let gridSquare of player1GameboardGridSquares) {
        gridSquare.addEventListener('mouseenter', hoverHandler);
        gridSquare.addEventListener('mouseleave', hoverHandler);
        gridSquare.addEventListener('click', placeShipHandler);
    }

    dialogs['place-ships-dialog'].appendChild(gameboardPlayer1);
}

function placeShipUISetup() {
    createPlaceShipUI();
    dialogs['place-ships-dialog'].showModal();
    // placeShipUIController();
}

function placeShipStylingHandler(shipObj) {
    for (let coordinate of shipObj.coordinates) {
        const gridSquare = document.querySelector(`#place-ships-dialog.player1 [id='${coordinate}'`);
        gridSquare.classList.toggle('ship-placed');
    }
}

function allShipsPlacedChecker(player) {
    const fleet = player.gameboard.fleet;
    for (let shipObj in fleet) {
        let setSize = fleet[shipObj].coordinates.size;
        if (!setSize) return false;
    }
    return true;
}

function cleanupAfterPlaceLastShip() {
    dialogs['place-ships-dialog'].close();
    const gameboardPlayer1 = document.querySelector('.gameboard.player1');
    const player1GameboardGridSquares = document.querySelectorAll('.gameboard.player1 div');

    for (let gridSquare of player1GameboardGridSquares) {
        gridSquare.removeEventListener('mouseenter', hoverHandler);
        gridSquare.removeEventListener('mouseleave', hoverHandler);
        gridSquare.removeEventListener('click', placeShipHandler);
    }

    const gameboardWrapper = document.querySelector('.gameboard-wrapper.player1')
    gameboardWrapper.appendChild(gameboardPlayer1);
}

function showWhatShipToPlace() {
    const placeShipPara = document.querySelector('#place-ship-para');
    const shipName = shipHandler.getCurrentShipName('player1');
    placeShipPara.textContent = `Place your ${shipName}`;
}

function placeShipHandler(e) {
 // Will need to be able to get either player later on
    const coordinates = e.target.id;
    const xCoord = coordinates[0];
    const yCoord = coordinates[1];
    const player1 = getPlayers().player1;
    const shipObj = shipHandler.getCurrentShipObj('player1');
    const orientation = orientationHandler.getOrientation();

    
    player1.gameboard.placeShip(shipObj, xCoord, yCoord, orientation);
    placeShipStylingHandler(shipObj);
    if (allShipsPlacedChecker(player1)) {
        cleanupAfterPlaceLastShip();
        return;
    } 
    shipHandler.updateCurrentShipIndex('player1');
    showWhatShipToPlace();
}

const gridHighlightHandler = (function() {
    function getElementCoordinatesToHighlight(shipObj, bowXCoordinate, bowYCoordinate, orientation) {
        const calculatedCoordinates = [`${bowXCoordinate}${bowYCoordinate}`];
        let nextXCoordinate = bowXCoordinate;
        let nextYCoordinate = bowYCoordinate;
    
        switch (orientation) {
            case 'north':
                for (let i = 1; i < shipObj.shipLength; i++) {
                    nextYCoordinate++;
                    calculatedCoordinates.push(`${bowXCoordinate}${nextYCoordinate}`);
                }
                break;
    
            case 'south':
                for (let i = 1; i < shipObj.shipLength; i++) {
                    nextYCoordinate--;
                    calculatedCoordinates.push(`${bowXCoordinate}${nextYCoordinate}`);
                }
                break;
    
            case 'east':
                for (let i = 1; i < shipObj.shipLength; i++) {
                    nextXCoordinate--;
                    calculatedCoordinates.push(`${nextXCoordinate}${bowYCoordinate}`);
                }
                break;
    
            case 'west':
                for (let i = 1; i < shipObj.shipLength; i++) {
                    nextXCoordinate++;
                    calculatedCoordinates.push(`${nextXCoordinate}${bowYCoordinate}`);
                }
                break;
        }
        return calculatedCoordinates;
    }
    
    function toggleElementHighlight(elementCoordinates) {
        for (let coordinate of elementCoordinates) {
            const gridSquare = document.querySelector(`#place-ships-dialog.player1 [id='${coordinate}'`);
            if (gridSquare === null) continue; // Because we get can't read props of null when highlight goes out of bounds
            gridSquare.classList.toggle('highlight');
        }
    }

    return {
        getElementCoordinatesToHighlight,
        toggleElementHighlight,
    }
})();


function hoverHandler(e) {
    const coordinates = e.target.id;
    const xCoord = coordinates[0];
    const yCoord = coordinates[1];
    const shipObj = shipHandler.getCurrentShipObj('player1'); // Will need to be able to get either player later on
    const orientation = orientationHandler.getOrientation();

    const elementCoordinatesToHighlight = gridHighlightHandler.getElementCoordinatesToHighlight(shipObj, xCoord, yCoord, orientation);
    gridHighlightHandler.toggleElementHighlight(elementCoordinatesToHighlight);
}

function addEventToGridSquares (event, callback) {
    const player1GameboardGridSquares = document.querySelectorAll('.gameboard.player1 div');
    const player2GameboardGridSquares = document.querySelectorAll('.gameboard.player2 div');

    for (let gridSquare of player1GameboardGridSquares) {
        gridSquare.addEventListener(`${event}`, callback);
    }

    for (let gridSquare of player2GameboardGridSquares) {
        gridSquare.addEventListener(`${event}`, callback);
    }
}

function removeEventFromGridSquares (event, callback) {
    const player1GameboardGridSquares = document.querySelectorAll('.gameboard.player1 div');
    const player2GameboardGridSquares = document.querySelectorAll('.gameboard.player2 div');

    for (let gridSquare of player1GameboardGridSquares) {
        gridSquare.removeEventListener('click', callback);
    }

    for (let gridSquare of player2GameboardGridSquares) {
        gridSquare.removeEventListener('click', callback);
    }
}

const shipHandler = (function () {
    // player1 and player2 always both have same fleet keys.
    let currentIndex;
    const indices = {
        'player1': 0,
        'player2': 0,
    };

    const fleet = getPlayers().player1.gameboard.fleet;
    const fleetKeys = Object.keys(fleet);
    const numOfShips = fleet.length;
    
    function getCurrentShipObj(player) {
        currentIndex = indices[player];
        let currentShipName = fleetKeys[currentIndex];
        let currentPlayerFleet = getPlayers()[player].gameboard.fleet;
        return currentPlayerFleet[currentShipName];
    }

    function getCurrentShipName(player) {
        currentIndex = indices[player];
        let currentShipName = fleetKeys[currentIndex];
        return currentShipName;
    }
    
    function updateCurrentShipIndex(player) {
        // on click, call this.
        indices[player]++
        if (indices[player] >= numOfShips) indices[player] = 0;
    }

    function resetCurrentShipIndex(player) {
        indices[player] = 0
    }

    return {
        getCurrentShipObj,
        getCurrentShipName,
        updateCurrentShipIndex,
        resetCurrentShipIndex,
    }
})();

const orientationHandler = (function() {
    const orientationBtn = document.querySelector('#orientation-btn');
    const orientationArr = ['north', 'east', 'south', 'west'];
    let counter = 0;
    let orientation = 'north';

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

export { initialPageSetup };

// IT'S OFFICIAL, EVERYTHING IS FUCKED UP. NEED TO RETHINK ALL OF THIS.
// STOP NESTING
// JUST CREATE REGULAR ASS HANDLERS
// REPEAT YOURSELF IF NEEDED AND REFACTOR LATER
// CONSIDER A SHIP HANDLER THAT GETS AND SETS

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

// FUNCTION TO UPDATE DOM WHEN SHIP IS PLACED
// On gridSquare click, run placeShip(); to place first ship in fleet
// then read that function to drive DOM update
// then update ship to be the next ship.

// FUNCTION TO CONTROL THE USER PLACINGSHIP
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

// I'm going to write this two ways - first with promises. Then with async await.