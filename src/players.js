import { Gameboard } from "./gameboard.js";

class Player {
    constructor(name) {
        this.name = name;   // Will be either human or computer
        this.gameboard = new Gameboard();
    }
}

const players = {
    'player1': new Player('player1'),
    'player2': new Player('player2'),
};

function getPlayers() {
    return players;
}

function updatePlayerName(player, name) {
    players[player].name = name;
}

export { getPlayers, updatePlayerName };