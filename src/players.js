import { Gameboard } from "./gameboard.js";

class Player {
    constructor(name, playerNum, attacker) {
        this.name = name;   // Will be either human or computer
        this.playerNum = playerNum
        this.attacker = attacker;
        this.gameboard = new Gameboard();
    }
}

const players = {
    'player1': new Player('player1', 'player1', true),
    'player2': new Player('player2', 'player2', false),
};

function getPlayers() {
    return players;
}

function updatePlayerName(player, name) {
    players[player].name = name;
}

function resetPlayers() {
    players.player1 = new Player('player1', 'player1', true);
    players.player2 = new Player('player2', 'player2', false);
}

export { getPlayers, updatePlayerName, resetPlayers };