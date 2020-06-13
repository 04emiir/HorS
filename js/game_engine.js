// Import the player arrows and the tilemap.
import {
    Player
} from "./player.js";

import {
    Tilemap
} from "./game_tilemap.js";

// Class to generate and control the flow of the game.
class GameEngine {
    constructor() {
        //Generates the tilemap with difficulty selected.
        this.map = new Tilemap();
        this.map.easyMap();

        //Create the player arrows.
        this.player_hover = new Player();

        //Apply opacity to the tilemap.
        this.map.applyOpacity(this.player_hover.current_tile_position);

        // Async callbacks for the key presses. Cooldown to not spam the jumps.
        document.onkeydown = (e) => this.keyboardInput(e);
        this.canJump = true;
        this.cooldown = null;

        // To control pause status
        this.game_paused = false;

        // To control if the game ended.
        this.gameWon = false;

        console.log("Map length: " + this.map.total_tiles);
        console.log("Foot placement: " + this.player_hover.foot_placement);
        console.log("Current position: " + this.player_hover.current_tile_position);
        console.log("Arrow lock: " + this.player_hover.set_hover_static);
        console.log("Pause status: " + this.game_paused);
        console.log("Game status: " + this.gameWon);
        console.log("----------");
    }

    keyboardInput(e) {
        //Detect which key is being pressed.
        var key = e.key;

        if ( ((key == "a" || key == "A" || key == "d" || key == "D" || key == "w" || key == "W") && (!this.game_paused && !this.gameWon)) ||
        ((key == "a" || key == "A" || key == "d" || key == "D" || key == "w" || key == "W") && !this.gameWon) ) {
            //Controls the movement of the map
            this.jumpAction(key);
            //Update the opacity after each movement
            this.map.applyOpacity(this.player_hover.current_tile_position);
        } else if (key == "Escape" && this.cooldown == null && !this.gameWon) {
            // Creates or deletes the pause screen.
            this.editPause();
            this.game_paused = !this.game_paused;

        }

        if (this.gameWon) {
            this.victoryScreen();
            setTimeout(() => {
                location.reload();
            }, 4000);
        }

        console.log("Map length: " + this.map.total_tiles);
        console.log("Foot placement: " + this.player_hover.foot_placement);
        console.log("Current position: " + this.player_hover.current_tile_position);
        console.log("Arrow lock: " + this.player_hover.set_hover_static);
        console.log("Pause status: " + this.game_paused);
        console.log("Game status: " + this.gameWon);
        console.log("----------");


    }

    jumpAction(key) {
        // Function called when the user jumps (press a jump key). If the jump is not in cooldown...
        if (this.canJump) {
            if (!this.player_hover.set_hover_static) {
                //... the arrows will move closer to the center.
                this.playerHoverMoves(key);
                this.checkForElectrocution(this.player_hover.current_tile_position, this.player_hover.foot_placement);
            } else {
                //... the arrows are locked. The tile_map will moved down instead.
                this.tileFloorMoves(key);
                this.checkForElectrocution(this.player_hover.current_tile_position, this.player_hover.foot_placement);
            }
        }
    }

    playerHoverMoves(key) {
        // Function used when the arrows move.
        if (key == "a" || key == "A") {
            document.getElementById("jumpSound").play();
            if (this.player_hover.jumpLeft(this.map.total_tiles) == 4) {
                this.gameWon = true;
            }
            this.player_hover.updateSVG();
        } else if (key == "d" || key == "D") {
            document.getElementById("jumpSound").play();
            if (this.player_hover.jumpRight(this.map.total_tiles) == 4) {
                this.gameWon = true;
            }
            this.player_hover.updateSVG();
        } else if (key == "w" || key == "W") {
            document.getElementById("jumpSound").play();
            var signal = this.player_hover.bigJump(this.map.total_tiles);

            if (signal === 2) {
                this.player_hover.updateSVG();
                this.map.moveDown();
            } else if (signal === 4) {
                this.gameWon = true;
                this.player_hover.updateSVG();
            } else {
                this.player_hover.updateSVG();
            }
        }
    }

    tileFloorMoves(key) {
        // Function used when the tile_map moves.
        if (key == "a" || key == "A") {
            document.getElementById("jumpSound").play();
            this.player_hover.jumpLeft(this.map.total_tiles);
            this.map.moveDown();
        } else if (key == "d" || key == "D") {
            document.getElementById("jumpSound").play();
            this.player_hover.jumpRight(this.map.total_tiles);
            this.map.moveDown();
        } else if (key == "w" || key == "W") {
            document.getElementById("jumpSound").play();
            if (this.player_hover.bigJump(this.map.total_tiles) == 3) {
                this.map.moveDown();
                this.player_hover.updateSVG();
            } else {
                this.map.moveDown();
                this.map.moveDown();
            }
        }
    }

    checkForElectrocution(position, foot_placement) {
        /*Function to detect if the player landed on a shock trap. If he did, I will not move in the next seconds.
        The parameter "position" indicates in which row tile is the user. The parameter "foot_placement" indicates the feet.*/

        switch (foot_placement) {

            case ("left"):
                // The tile was a shock trap. Long cooldown.
                if (this.map.current_tilemap[position][0].stepped() == true) {
                    document.getElementById("zapSound").play();
                    this.canJump = false;
                    this.cooldown = setTimeout(() => {
                        this.canJump = true;
                        this.cooldown = null;
                    }, 1300);
                } else {
                    // The tile was not a shock trap. Short cooldown.
                    this.canJump = false;
                    this.cooldown = setTimeout(() => {
                        this.canJump = true;
                        this.cooldown = null;
                    }, 200);
                }
                break;

            case ("right"):
                // Ditto
                if (this.map.current_tilemap[position][1].stepped() == true) {
                    document.getElementById("zapSound").play();
                    this.canJump = false;
                    this.cooldown = setTimeout(() => {
                        this.canJump = true;
                        this.cooldown = null;
                    }, 1300);
                } else {
                    // Ditto 
                    this.canJump = false;
                    this.cooldown = setTimeout(() => {
                        this.canJump = true;
                        this.cooldown = null;
                    }, 200);
                }
                break;

            case ("both"):
                // Here, we have to check both tiles.
                var zap = 0;
                for (var row of this.map.current_tilemap[position]) {
                    if (row.stepped())
                        zap++;
                }
                if (zap > 0) {
                    // At least, one tile was a shock trap. Long cooldown.
                    document.getElementById("zapSound").play();
                    this.canJump = false;
                    this.cooldown = setTimeout(() => {
                        this.canJump = true;
                        this.cooldown = null;
                    }, 1300);
                } else {
                    // No traps. Short cooldown.
                    this.canJump = false;
                    this.cooldown = setTimeout(() => {
                        this.canJump = true;
                        this.cooldown = null;
                    }, 200);
                }
                break;

            default:


        }

    }

    editPause() {
        var game_screen = document.getElementById("game_screen");
        if (!this.game_paused) {
            //Creates a pause screen
            var pause = document.createElementNS("http://www.w3.org/2000/svg", "image");
            //  Attributes pause (when paused inside the game)

            document.getElementById("pauseSound").play();

            pause.setAttribute("href", "../assets/pause.png");
            pause.setAttribute("x", 0);
            pause.id = "pause";
            pause.setAttribute("y", 0);
            pause.setAttribute("width", 1280);
            pause.setAttribute("height", 640);
            game_screen.appendChild(pause);

            // To avoid spamming "Esc"
            this.cooldown = setTimeout(() => {
                this.canJump = true;
                this.cooldown = null;
            }, 2000);

        } else {
            //Deletes the game screen
            var current_pause = document.getElementById("game_screen").getElementById("pause");
            game_screen.removeChild(current_pause);
        }
    }

    victoryScreen() {
        var game_screen = document.getElementById("game_screen");
        var win = document.createElementNS("http://www.w3.org/2000/svg", "image");

        document.getElementById("endSound").play();

        //  Attributes win (when winning the game)
        win.setAttribute("href", "../assets/win.png");
        win.setAttribute("x", 0);
        win.id = "win";
        win.setAttribute("y", 0);
        win.setAttribute("width", 1280);
        win.setAttribute("height", 640);
        game_screen.appendChild(win);

    }
}

window.onload = () => {
    gameElements();
    var game = new GameEngine();
    document.getElementById("bgSound").play();


}

function gameElements() {
    var pauseSound = document.createElement("AUDIO");
    pauseSound.src = "../assets/pauseSound.mp3"
    pauseSound.controls = false;
    pauseSound.id = "pauseSound";
    pauseSound.style = "display:none"
    document.body.appendChild(pauseSound);

    var zapSound = document.createElement("AUDIO");
    zapSound.src = "../assets/zapSound.wav"
    zapSound.id = "zapSound";
    zapSound.style = "display:none"
    document.body.appendChild(zapSound);

    var jumpSound = document.createElement("AUDIO");
    jumpSound.src = "../assets/jumpSound.wav"
    jumpSound.id = "jumpSound";
    jumpSound.style = "display:none"
    document.body.appendChild(jumpSound);

    var endSound = document.createElement("AUDIO");
    endSound.src = "../assets/endSound.wav"
    endSound.id = "endSound";
    endSound.style = "display:none"
    document.body.appendChild(endSound);

    var bgSound = document.createElement("AUDIO");
    bgSound.src = "../assets/backgroundSound.mp3"
    bgSound.id = "bgSound";
    bgSound.style = "display:none"
    bgSound.loop = true;
    document.body.appendChild(bgSound);
}





