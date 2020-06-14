// Import the player arrows and the tilemap.
import {
    Player
} from "./player.js";

import {
    Tilemap
} from "./game_tilemap.js";

// Class to generate and control the flow of the game.
class GameEngine {
    constructor(difficulty) {
        //Generates the tilemap with difficulty selected.
        this.map = new Tilemap();

        switch (difficulty) {
            case (1):
                this.map.easyMap();
                break;
            case (2):
                this.map.mediumMap();
                break;
            case (3):
                this.map.hardMap();
                break;
        }

        this.difficulty = difficulty;

        //Create the player arrows.
        this.player_hover = new Player();

        //Apply opacity to the tilemap.
        this.map.applyOpacity(this.player_hover.current_tile_position);

        this.play_screen = document.getElementById("game_screen");

        this.limit_time = this.map.limit_time;
        
        this.showRaceInfo();
        this.editControls();

        // Async callbacks for the key presses. Cooldown to not spam the jumps.
        document.onkeydown = (e) => this.keyboardInput(e);
        this.canJump = true;
        this.cooldown = null;

        // To control pause status
        this.game_paused = false;

        // To control if the game ended.
        this.gameWon = false;

        this.spamLock = false;

        this.turn_controls = true;

        document.getElementById("bgSound").volume = 0.4;

        this.stopwatch_control = setInterval(this.updateStopwatch.bind(this), 10);

    }

    keyboardInput(e) {
        //Detect which key is being pressed.
        var key = e.key;

        if ((key == "a" || key == "A" || key == "d" || key == "D" || key == "w" || key == "W") &&
            (!this.gameWon && !this.game_paused)) {
            //Controls the movement of the map
            this.jumpAction(key);
            //Update the opacity after each movement
            this.map.applyOpacity(this.player_hover.current_tile_position);
        } else if (key == "Escape" && this.cooldown == null && !this.gameWon) {
            // Creates or deletes the pause screen.
            this.editPause();
            this.game_paused = !this.game_paused;
        } else if ((key == "q" || key == "Q") && this.game_paused) {
            window.location.href = "https://www.google.com";
        } else if ((key == "r" || key == "R") && this.game_paused) {
            location.reload();
        } else if ((key == "c" || key == "C") && !this.game_paused) {
            this.editControls();
            this.turn_controls = !this.turn_controls;
        }

        this.updateRemainingTile();

        if (this.gameWon && this.spamLock == false) {
            this.spamLock = true;
            this.updateRaceRecord();
            this.victoryScreen();

            setTimeout(() => {
                location.reload();
            }, 4000);
        }


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
        var bg = document.getElementById("bgSound");

        if (!this.game_paused) {
            //Creates a pause screen
            var pause = document.createElementNS("http://www.w3.org/2000/svg", "image");

            //  Sound effects
            document.getElementById("pauseSound").play();
            bg.volume = 0.1;

            // Attribu
            pause.setAttribute("href", "assets/pause.png");
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
            bg.volume = 0.4;
            var current_pause = document.getElementById("game_screen").getElementById("pause");
            game_screen.removeChild(current_pause);
        }
    }

    victoryScreen() {
        var game_screen = document.getElementById("game_screen");
        var win = document.createElementNS("http://www.w3.org/2000/svg", "image");

        document.getElementById("endSound").play();

        //  Attributes win (when winning the game)
        win.setAttribute("href", "assets/win.png");
        win.setAttribute("x", 0);
        win.id = "win";
        win.setAttribute("y", 0);
        win.setAttribute("width", 1280);
        win.setAttribute("height", 640);
        game_screen.appendChild(win);

    }

    editControls() {
        var game_screen = document.getElementById("game_screen");

        if (!this.turn_controls) {

            //Creates a pause screen
            var controls = document.createElementNS("http://www.w3.org/2000/svg", "image");

            // Attribu
            controls.setAttribute("href", "assets/controls_menu.png");
            controls.setAttribute("x", 0);
            controls.id = "controls";
            controls.setAttribute("y", 0);
            controls.setAttribute("width", 576);
            controls.setAttribute("height", 640);
            game_screen.appendChild(controls);

            // To avoid spamming "Esc"
            this.cooldown = setTimeout(() => {
                this.canJump = true;
                this.cooldown = null;
            }, 1000);

        } else {
            //Deletes the game screen
            var control_image = document.getElementById("game_screen").getElementById("controls");
            game_screen.removeChild(control_image);
        }
    }

    showRaceInfo() {
        var game_screen = document.getElementById("game_screen");

        var foot = document.createElementNS("http://www.w3.org/2000/svg", "image");
        foot.setAttribute("x", 960);
        foot.setAttribute("y", 150);
        foot.id = "foot";
        foot.setAttribute("width", 64);
        foot.setAttribute("height", 64);
        foot.setAttribute("href", "assets/foot.png");
        game_screen.appendChild(foot);

        var current_tiles_remaining = document.createElementNS("http://www.w3.org/2000/svg", "text");
        current_tiles_remaining.textContent = "0" + this.player_hover.current_tile_position + " / " + this.map.total_tiles;
        current_tiles_remaining.setAttribute("x", 1056);
        current_tiles_remaining.setAttribute("y", 198);
        current_tiles_remaining.id = "current_tiles_remaining";
        current_tiles_remaining.setAttribute("fill", "yellow");
        current_tiles_remaining.setAttribute("font-size", 20);
        current_tiles_remaining.setAttribute("font-weight", "bold");
        game_screen.appendChild(current_tiles_remaining);

        var clock = document.createElementNS("http://www.w3.org/2000/svg", "image");
        clock.setAttribute("x", 968);
        clock.setAttribute("y", 308);
        clock.id = "clock";
        clock.setAttribute("width", 48);
        clock.setAttribute("height", 48);
        clock.setAttribute("href", "assets/clock.png");
        game_screen.appendChild(clock);

        var remaining_time = document.createElementNS("http://www.w3.org/2000/svg", "text");
        remaining_time.textContent = limitToTimer(this.limit_time);
        remaining_time.setAttribute("x", 1056);
        remaining_time.setAttribute("y", 348);
        remaining_time.id = "remaining_time";
        remaining_time.setAttribute("fill", "yellow");
        remaining_time.setAttribute("font-size", 20);
        remaining_time.setAttribute("font-weight", "bold");
        game_screen.appendChild(remaining_time);

        var crown = document.createElementNS("http://www.w3.org/2000/svg", "image");
        crown.setAttribute("x", 960);
        crown.setAttribute("y", 450);
        crown.id = "crown";
        crown.setAttribute("width", 64);
        crown.setAttribute("height", 64);
        crown.setAttribute("href", "assets/crown.png");
        game_screen.appendChild(crown);

        var best_time = document.createElementNS("http://www.w3.org/2000/svg", "text");

        var current_record = localStorage.getItem(this.difficulty);
        if (current_record != null) {
            best_time.textContent = limitToTimer(parseInt(current_record));
        } else {
            best_time.textContent = "00:00.000";
        }

        best_time.setAttribute("x", 1056);
        best_time.setAttribute("y", 498);
        best_time.id = "best_time";
        best_time.setAttribute("fill", "yellow");
        best_time.setAttribute("font-size", 20);
        best_time.setAttribute("font-weight", "bold");
        game_screen.appendChild(best_time);
    }

    updateRemainingTile() {
        if (this.player_hover.current_tile_position < 10)
            this.play_screen.getElementById("current_tiles_remaining").textContent = "0" + this.player_hover.current_tile_position +
            " / " + this.map.total_tiles;
        else
            this.play_screen.getElementById("current_tiles_remaining").textContent = this.player_hover.current_tile_position +
            " / " + this.map.total_tiles;
    }

    updateStopwatch() {
        if (this.limit_time <= 0) {
            clearInterval(this.stopwatch_control);
            this.stopwatch_control = null;
            return;
        }

        if (!this.game_paused) {
            this.limit_time--;
        }

        document.getElementById("game_screen").getElementById("remaining_time").textContent = limitToTimer(this.limit_time);
    }

    updateRaceRecord () {
        var last_record = localStorage.getItem(this.difficulty);

        if (last_record === null) {
            localStorage.setItem(this.difficulty, this.limit_time);
            window.alert("Nuevo record : " + limitToTimer(this.limit_time));
        } else if (parseInt(last_record) < this.limit_time) {
            localStorage.setItem(this.difficulty, this.limit_time);
            window.alert("Nuevo record : " + limitToTimer(this.limit_time));
        }
    }
}

////// GAME IS BORN HERE ////
gameSounds();

difficultySelection();
var arrow_position = 270;

document.onkeydown = function (e) {
    var key = e.key;
    if (key == "w" || key == "W") {
        arrow_position -= 135;
        moveArrow(arrow_position);
    } else if (key == "s" || key == "S") {
        arrow_position += 135;
        moveArrow(arrow_position);
    } else if (key == "Enter") {
        document.onkeydown = null;
        removeDifficultySelection();
        getReadyScreen(arrow_position);
    }
}
/////// GAME ENDS HERE ////

function gameSounds() {
    var pauseSound = document.createElement("AUDIO");
    pauseSound.src = "assets/pauseSound.mp3"
    pauseSound.controls = false;
    pauseSound.id = "pauseSound";
    pauseSound.volume = 0.7
    pauseSound.style = "display:none"
    document.body.appendChild(pauseSound);

    var zapSound = document.createElement("AUDIO");
    zapSound.src = "assets/zapSound.wav"
    zapSound.id = "zapSound";
    zapSound.style = "display:none"
    document.body.appendChild(zapSound);

    var jumpSound = document.createElement("AUDIO");
    jumpSound.src = "assets/jumpSound.wav"
    jumpSound.id = "jumpSound";
    jumpSound.volume = 0.6
    jumpSound.style = "display:none"
    document.body.appendChild(jumpSound);

    var endSound = document.createElement("AUDIO");
    endSound.src = "assets/endSound.wav"
    endSound.id = "endSound";
    endSound.style = "display:none"
    document.body.appendChild(endSound);

    var bgSound = document.createElement("AUDIO");
    bgSound.src = "assets/backgroundSound.mp3"
    bgSound.id = "bgSound";
    bgSound.style = "display:none"
    bgSound.loop = true;
    bgSound.volume = 0.1;
    document.body.appendChild(bgSound);

    var readySound = document.createElement("AUDIO");
    readySound.src = "assets/readySound.wav"
    readySound.id = "readySound";
    readySound.style = "display:none"
    document.body.appendChild(readySound);

    var beepSound = document.createElement("AUDIO");
    beepSound.src = "assets/beepSound.wav"
    beepSound.id = "beepSound";
    beepSound.style = "display:none"
    document.body.appendChild(beepSound);
}

function getReadyScreen(arrow_position) {
    var game_screen = document.getElementById("game_screen");
    var countdown = document.createElementNS("http://www.w3.org/2000/svg", "image")
    countdown.setAttribute("x", 0);
    countdown.setAttribute("y", 0);
    countdown.id = "countdown";
    countdown.setAttribute("width", 1280);
    countdown.setAttribute("height", 640);
    countdown.setAttribute("href", "assets/readyimage.png");
    game_screen.appendChild(countdown);

    document.getElementById("readySound").play();
    document.getElementById("bgSound").play();

    setTimeout(() => {
        document.getElementById("beepSound").play();
        countdown.setAttribute("href", "assets/3.png");

        setTimeout(() => {
            document.getElementById("beepSound").play();
            countdown.setAttribute("href", "assets/2.png");

            setTimeout(() => {
                document.getElementById("beepSound").play();
                countdown.setAttribute("href", "assets/1.png");

                setTimeout(() => {
                    document.getElementById("endSound").play();

                    var screen = document.getElementById("game_screen");
                    screen.removeChild(document.getElementById("countdown"));

                    switch (arrow_position) {
                        case (405):
                            var game = new GameEngine(1);
                            break;
                        case (270):
                            var game = new GameEngine(2);
                            break;
                        case (135):
                            var game = new GameEngine(3);
                            break;
                    }

                }, 1200);

            }, 1200);

        }, 1200);

    }, 1200);
}

function difficultySelection() {
    var game_screen = document.getElementById("game_screen");

    var difficulty = document.createElementNS("http://www.w3.org/2000/svg", "image")
    difficulty.setAttribute("x", 0);
    difficulty.setAttribute("y", 0);
    difficulty.id = "difficulty";
    difficulty.setAttribute("width", 1280);
    difficulty.setAttribute("height", 640);
    difficulty.setAttribute("href", "assets/difficulty.png");
    game_screen.appendChild(difficulty);

    var selection_arrow = document.createElementNS("http://www.w3.org/2000/svg", "image");
    selection_arrow.setAttribute("href", "assets/hoverplayerleft.gif");
    selection_arrow.setAttribute("x", 260);
    selection_arrow.setAttribute("y", 270);
    selection_arrow.id = "selection_arrow";
    selection_arrow.setAttribute("width", 128);
    selection_arrow.setAttribute("height", 128);
    game_screen.appendChild(selection_arrow);
}

function moveArrow(current) {
    var selection_arrow = document.getElementById("game_screen").getElementById("selection_arrow");

    if (current < 135) {
        arrow_position = 405;
        selection_arrow.setAttribute("y", arrow_position);
    } else if (current > 405) {
        arrow_position = 135;
        selection_arrow.setAttribute("y", arrow_position);
    } else {
        selection_arrow.setAttribute("y", arrow_position);
    }
}

function removeDifficultySelection() {
    var game_screen = document.getElementById("game_screen");
    var difficulty = game_screen.getElementById("difficulty");
    var arrow = game_screen.getElementById("selection_arrow");
    game_screen.removeChild(difficulty);
    game_screen.removeChild(arrow);
}

function limitToTimer(time) {
    var min = Math.floor(time / (60 * 100));
    var se = Math.floor((time - min * 60 * 100) / 100);
    var ms = time - Math.floor(time / 100) * 100;
    return fillZero(min) + ":" + fillZero(se) + "." + fillZero(ms);
}

function fillZero(num) {
    return num < 10 ? '0' + num : num;
};