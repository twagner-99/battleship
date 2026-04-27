import { Gameboard } from "./gameboard.js";

class Player {
    constructor(name) {
        this.name = name;   // Will be either human or computer
        this.gameboard = new Gameboard();
    }
}

const players = {};

function createPlayer(key, name) {
    const player = new Player(name);
    players[key] = player;
}

function getPlayers() {
    return players;
}

export { createPlayer, getPlayers };