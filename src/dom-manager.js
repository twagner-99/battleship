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
    btns['ok-btn'].addEventListener('click', () => dialogs['ship-hit-message-dialog'].close());
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

const playerHandler = (function() {
    const players = getPlayers();

    function getAttackingPlayerObj() {
        for (let player in players) {
            if (players[player].attacker) return players[player];
        }
    }

    function getDefensivePlayerObj() {
        for (let player in players) {
            if (!players[player].attacker) return players[player];
        }
    }
    
    function togglePlayer() {
        for (let player in players) {
            players[player].attacker = (players[player].attacker === true) ? false : true;
        }
    }

    return {
        getAttackingPlayerObj,
        getDefensivePlayerObj,
        togglePlayer,
    }
})();

function receiveAttackHandler(e) {
    const coordinates = e.target.id;
    const xCoord = coordinates[0];
    const yCoord = coordinates[1];

    const player = playerHandler.getDefensivePlayerObj();
    const playerNum = player.playerNum;
    const hitData = player.gameboard.receiveAttack(xCoord, yCoord);
    displayMessage(hitData, player);
    receiveAttackStylingHandler(hitData, coordinates, playerNum);
    playerHandler.togglePlayer();
}

function receiveAttackStylingHandler(hitData, coordinates, playerNum) {  
    const gridSquare = document.querySelector(`.gameboard.${playerNum} [id='${coordinates}'`);

    if (hitData.shipHit) gridSquare.classList.toggle('attack-hit');
    else gridSquare.classList.toggle('attack-missed');
}

function displayMessage(hitData, player) {
    const fleet = player.gameboard.fleet;
    const fleetSize = Object.keys(fleet).length;
    let message;
    let counter = 1;

    if (hitData.shipHit) message = `Your ${hitData.shipType} has been hit!`;
    else if (hitData.shipSunk) message = ` Your ${hitData.shipType} has been sunk!`;
    else message = 'Attack missed!';

    for (let shipObj in fleet) {
        if (!fleet[shipObj].isSunk()) break;
        else if (fleet[shipObj].isSunk() && counter === fleetSize) message = `All your ships have been sunk!`;
        counter++;
    }
    
    const shipHitMessagePara = document.querySelector('#ship-hit-message-para');
    shipHitMessagePara.textContent = message;
    dialogs['ship-hit-message-dialog'].showModal();
}

// Will need to update to allow player1 board to be clicked if two players
function createReceiveAttackUI() {
    const gridSquares = document.querySelectorAll('.player2.gameboard div');
        
    for (let gridSquare of gridSquares) {
        gridSquare.addEventListener('click', receiveAttackHandler);
    }
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
        createReceiveAttackUI();
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

    // might want to move this to add clickEvents function
    orientationBtn.addEventListener('click', toggleOrientation);

    return {
        getOrientation,
    }
})();


function removeAllChildren(parent) {
    while (parent.lastChild) parent.removeChild(parent.lastChild);
}

export { initialPageSetup };