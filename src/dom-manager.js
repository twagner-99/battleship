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
    btns['ok-btn'].addEventListener('click', computerTurnHandler);
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

function dispatchComputerAttack() {
    const computerAttack = new Event('click');
    const coordinate = randomCoordinateGenerator.getRandomCoordinates();
    const gridSquare = document.querySelector(`.gameboard.player1 [id='${coordinate}'`);

    gridSquare.dispatchEvent(computerAttack);
}

const randomCoordinateGenerator = (function() {
    const coordinateTracker = new Set();

    function getRandomCoordinates() {
        let coordinates = Math.floor(Math.random() * 100);
        while (coordinateTracker.has(coordinates)) coordinates = Math.floor(Math.random() * 100);
        coordinateTracker.add(coordinates);

        if (String(coordinates).length === 1) return `0${coordinates}`
        return `${coordinates}`;
    }

    return {
        getRandomCoordinates
    }
})();

function receiveAttackHandler(e) {
    const coordinates = e.target.id;
    const xCoord = coordinates[0];
    const yCoord = coordinates[1];
    let defensivePlayer = playerHandler.getDefensivePlayerObj();
    let attackingPlayer = playerHandler.getAttackingPlayerObj();
    const hitData = defensivePlayer.gameboard.receiveAttack(xCoord, yCoord);

    // BUG - having issues ending game
        // Leaving this to make sure ships not placed on top of each other.
    if (gameOverChecker(defensivePlayer)) {
        displayMessage(hitData, defensivePlayer, attackingPlayer);
        // Go back to new game modal after this
        return;
    }

    displayMessage(hitData, defensivePlayer, attackingPlayer);
    receiveAttackStylingHandler(hitData, coordinates, defensivePlayer.playerNum);
    playerHandler.togglePlayer();

    // recommend a timer before displatching computer attack display message
}

function computerTurnHandler() {
    dialogs['ship-hit-message-dialog'].close()
    const attackingPlayer = playerHandler.getAttackingPlayerObj();
    // Could be improved to handle all lower case, too
    if (attackingPlayer.name === 'Computer') {
        dispatchComputerAttack();
    }
}

function gameOverChecker(defensivePlayer) {
    const fleet = defensivePlayer.gameboard.fleet;
    for (let shipObj in fleet) {
        if (!fleet[shipObj].isSunk()) return false;
    }
    return true;
}

function receiveAttackStylingHandler(hitData, coordinates, playerNum) {  
    const gridSquare = document.querySelector(`.gameboard.${playerNum} [id='${coordinates}'`);

    if (hitData.shipHit) gridSquare.classList.toggle('attack-hit');
    else gridSquare.classList.toggle('attack-missed');
}

function displayMessage(hitData, defensivePlayer, attackingPlayer) {
    const fleet = defensivePlayer.gameboard.fleet;
    const fleetSize = Object.keys(fleet).length;
    let message;
    let counter = 1;

    if (hitData.shipHit) message = `${attackingPlayer.name} hit ${defensivePlayer.name}'s ${hitData.shipType}!`;
    else if (hitData.shipSunk) message = `${attackingPlayer.name} sunk ${defensivePlayer.name}'s ${hitData.shipType}!`;
    else message = `${attackingPlayer.name}'s attack missed!`;

    for (let shipObj in fleet) {
        if (!fleet[shipObj].isSunk()) break;
        else if (fleet[shipObj].isSunk() && counter === fleetSize) message = `${attackingPlayer.name} sunk ${defensivePlayer.name}'s entire fleet! ${attackingPlayer.name} wins!`;
        counter++;
    }
    
    const shipHitMessagePara = document.querySelector('#ship-hit-message-para');
    shipHitMessagePara.textContent = message;
    dialogs['ship-hit-message-dialog'].showModal();
}

// Will need to update to allow player1 board to be clicked if two players
function createReceiveAttackUI() {
    const gridSquares = document.querySelectorAll('.gameboard div');
        
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
    placeAllComputerShips();
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

    try {
        player1.gameboard.placeShip(shipObj, xCoord, yCoord, orientation);
    } catch(e) {
        alert(e.message);
        return;
    }

    placeShipStylingHandler(shipObj);
    if (allShipsPlacedChecker(player1)) {
        cleanupAfterPlaceLastShip();
        createReceiveAttackUI();
        return;
    }

    shipHandler.updateCurrentShipIndex('player1');
    showWhatShipToPlace();
}

function placeAllComputerShips() {
    const computer = getPlayers().player2;
    const computerFleet = computer.gameboard.fleet;
    
    for (let shipName in computerFleet) {
        let truthChecker = true;
        while (truthChecker) {
            try {
                const orientation = getRandomOrientation();
                const coordinate = randomCoordinateGenerator.getRandomCoordinates();
                const xCoord = coordinate[0];
                const yCoord = coordinate[1];
                computer.gameboard.placeShip(computerFleet[shipName], xCoord, yCoord, orientation);
                truthChecker = false;
            } catch(e) {
                truthChecker = true;
            }
        }
    }
}

const gridHighlightHandler = (function() {
    function getElementCoordinatesToHighlight(shipObj, bowXCoordinate, bowYCoordinate, orientation) {
        const calculatedCoordinates = [`${bowXCoordinate}${bowYCoordinate}`];
        let nextXCoordinate = bowXCoordinate;
        let nextYCoordinate = bowYCoordinate;
    
        switch (orientation) {
            case 'vertical':
                for (let i = 1; i < shipObj.shipLength; i++) {
                    nextYCoordinate++;
                    calculatedCoordinates.push(`${bowXCoordinate}${nextYCoordinate}`);
                }
                break;
    
            case 'horizontal':
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

// Consider placing this in an IIFE with getRandomCoordinate for organization
function getRandomOrientation() {
    const orientationArr = ['vertical', 'horizontal'];
    const randomIndex = Math.floor(Math.random() * orientationArr.length);
    return orientationArr[randomIndex];
}

const orientationHandler = (function() {
    const orientationBtn = document.querySelector('#orientation-btn');
    const orientationArr = ['vertical', 'horizontal'];
    let counter = 0;
    let orientation = 'vertical';

    function getOrientation() {
        return orientation;
    }

    function toggleOrientation() {
        counter++;
        if (counter > (orientationArr.length - 1)) counter = 0;
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

// Need to fix - 
    // Need to make sure player and computer can't place ships on top of each other
        // Even further, make sure they have at least one grid between
    // Need to add end game and ability to start new game once fleet is sunk - WORKING ON THIS. HAVING PROBLEMS