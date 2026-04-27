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
    createGameboardGridDivs();
    document.querySelector('#new-game-dialog').showModal();
}

function createGameboardGridDivs(numGridSquares = 100) {
    const gameboards = document.querySelectorAll('.gameboard');

    for (let gameboard of gameboards) {
        for (let i = 0; i < numGridSquares; i++) {
            const gridSquare = document.createElement('div');
            gameboard.appendChild(gridSquare);
        }
    }
}

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

    createPlayer('player1', newPlayerInput.value);
    createPlayer('player2', 'Computer');

    dialogs['new-player-dialog'].close();
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