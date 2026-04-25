import { Gameboard } from "./gameboard.js";

class Players {
    constructor(type) {
        this.type = type;   // Will be either human or computer
        this.gameboard = new Gameboard();
    }
}

export { Players };