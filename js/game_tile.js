// Class that have the game tiles (dance tiles, shock traps, start/finish lines).
export class Game_tile {
    //Spawn X and Y determines where the tiles are gonna be created in the SVG.
    constructor(spawn_x, spawn_y) {
        this.game_screen = document.getElementById("game_screen");
        this.tile = document.createElementNS("http://www.w3.org/2000/svg", "image");

        this.position_x = spawn_x;
        this.position_y = spawn_y;

        //  Attributes for tile
        this.tile.setAttribute("x", this.position_x);
        this.tile.setAttribute("y", this.position_y);
        this.tile.setAttribute("width", 64);
        this.tile.setAttribute("height", 64);

        //Add tile to the SVG
        this.game_screen.appendChild(this.tile);

    }

    moveDown() {
        //Move the tile down (1 place down out of 10, to be precise).
        this.position_y += 64;
    }

    updateSVG() {
        //Update the changes in the SVG.
        this.tile.setAttribute("y", this.position_y);
    }
}

//Extended class, tile that electrocutes the player.
export class Shock_trap extends Game_tile {
    constructor(spawn_x, spawn_y) {
        super(spawn_x, spawn_y);
        this.tile.setAttribute("href", "assets/shocktrap.png");
    }

    stepped() {
        //When steping on; return true(a.k.a electrocuted).
        return true;
    }
    
}

//Extended class, normal tile on the left side.
export class Left_foot_tile extends Game_tile {
    constructor(spawn_x, spawn_y) {
        super(spawn_x, spawn_y);
        this.tile.setAttribute("href", "./assets/leftfoot.jpg");
    }

    stepped() {
        //When steping on; return false. Change the image.
        this.tile.setAttribute("href", "./assets/leftfoot_activated.jpg");
        return false;
    }
    
}

//Extended class, normal tile on the right side.
export class Right_foot_tile extends Game_tile {
    constructor(spawn_x, spawn_y) {
        super(spawn_x, spawn_y);
        this.tile.setAttribute("href", "./assets/rightfoot.png");      
    }

    stepped() {
        //When steping on; return false. Change the image.
        this.tile.setAttribute("href", "./assets/rightfoot_activated.png");
        return false;
    }
}

//Extended class, start/finish tile.
export class Finish_tile extends Game_tile {
    constructor(spawn_x, spawn_y) {
        super(spawn_x, spawn_y);
        this.tile.setAttribute("href", "./assets/starting_finish_line.png");      
    }

    stepped() {
        //When steping on; return false. 
        return false;
    }
}