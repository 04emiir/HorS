// All tiles will merge together to create one "tile_map", the race. 
import { Game_tile, Shock_trap, Right_foot_tile, Left_foot_tile, Finish_tile} from "./game_tile.js";

// Class that contains the tilemap of the race inside an array.
export class Tilemap {
    constructor() {
        // Attribute that contains the multidimensional array. Each [] represent a row, being [][0] left and [][1] right.
        this.current_tilemap = new Array();

        // Attribute that contains the total length of the race (start and finish line included).
        this.total_tiles;
    }

    easyMap() {
        // With this function, the tile_map will be an easy one (less traps and length)
        var length = 60;
        this.total_tiles = length + 1;
        var spawn_y = 576;

        // I create the starting line before the loop.
        var starting_left = new Finish_tile(576, spawn_y);
        var starting_right = new Finish_tile(640, spawn_y)
        this.current_tilemap.push([starting_left, starting_right]);

        // The next row of tiles will be above the starting line.
        spawn_y -= 64;

        var i = 0;
        while (i < length) {
            //Loop to populate the array.
            var spawn_row = spawn_rates();

            if (spawn_row <= 50) {
                // 50% chance of a row with no traps.
                var tile_left = new Left_foot_tile(576, spawn_y);
                var tile_right = new Right_foot_tile(640, spawn_y)
                this.current_tilemap.push([tile_left, tile_right]);

                // One row completed
                i++;

                // Next row will be above this one.
                spawn_y -= 64;

            } else if (spawn_row >= 51 && spawn_row <= 70) {
                // 20% chance of a row with trap in the left side.
                var shock_left = new Shock_trap(576, spawn_y);
                var tile_right = new Right_foot_tile(640, spawn_y)
                this.current_tilemap.push([shock_left, tile_right]);

                // Ditto
                i++;
                spawn_y -= 64;

            } else if (spawn_row >= 71 && spawn_row <= 90) {
                // 20% chance of a row with trap in the right side.
                var tile_left = new Left_foot_tile(576, spawn_y);
                var shock_right = new Shock_trap(640, spawn_y)
                this.current_tilemap.push([tile_left, shock_right]);

                // Ditto
                i++;
                spawn_y -= 64;
                
            } else if (spawn_row >= 91 && spawn_row <= 100) {
                // 10% chance of a row fully trapped.
                var shock_left = new Shock_trap(576, spawn_y);
                var shock_right = new Shock_trap(640, spawn_y)
                this.current_tilemap.push([shock_left, shock_right]);

                // Ditto
                spawn_y -= 64;
                i++

                /* After a row with traps in both sides is generated, the next row has to be free of traps.
                You have to perform a big jump to surpass this row, and you will land on both feet. Thats why.*/
                var tile_left = new Left_foot_tile(576, spawn_y);
                var tile_right = new Right_foot_tile(640, spawn_y)
                this.current_tilemap.push([tile_left, tile_right]);

                // Ditto
                spawn_y -= 64;
                i++
            }
        }

        // I create the finish line after the loop.
        var finish_left = new Finish_tile(576, spawn_y);
        var finish_right = new Finish_tile(640, spawn_y)
        this.current_tilemap.push([finish_left, finish_right]);

        
    }

    mediumMap() {
        // With this function, the tile_map will be an average one.
        var length = 80;
        this.total_tiles = length + 1;
        var spawn_y = 576;

        // I create the starting line before the loop.
        var starting_left = new Finish_tile(576, spawn_y);
        var starting_right = new Finish_tile(640, spawn_y)
        this.current_tilemap.push([starting_left, starting_right]);

        // The next row of tiles will be above the starting line.
        spawn_y -= 64;

        var i = 0;
        while (i < length) {
            //Loop to populate the array.
            var spawn_row = spawn_rates();

            if (spawn_row <= 40) {
                // 40% chance of a row with no traps.
                var tile_left = new Left_foot_tile(576, spawn_y);
                var tile_right = new Right_foot_tile(640, spawn_y)
                this.current_tilemap.push([tile_left, tile_right]);

                // Ditto
                i++;
                spawn_y -= 64;

            } else if (spawn_row >= 41 && spawn_row <= 63) {
                // 22.5% chance of a row with trap in the left side.
                var shock_left = new Shock_trap(576, spawn_y);
                var tile_right = new Right_foot_tile(640, spawn_y)
                this.current_tilemap.push([shock_left, tile_right]);

                // Ditto
                i++;
                spawn_y -= 64;

            } else if (spawn_row >= 64 && spawn_row <= 85) {
                 // 22.5% chance of a row with trap in the right side.
                var tile_left = new Left_foot_tile(576, spawn_y);
                var shock_right = new Shock_trap(640, spawn_y)
                this.current_tilemap.push([tile_left, shock_right]);

                // Ditto
                i++;
                spawn_y -= 64;
                
            } else if (spawn_row >= 86 && spawn_row <= 100) {
                // 15% chance of a row fully trapped.
                var shock_left = new Shock_trap(576, spawn_y);
                var shock_right = new Shock_trap(640, spawn_y)
                this.current_tilemap.push([shock_left, shock_right]);

                // Ditto
                spawn_y -= 64;
                i++

                /* After a row with traps in both sides is generated, the next row has to be free of traps.
                You have to perform a big jump to surpass this row, and you will land on both feet. Thats why.*/
                var tile_left = new Left_foot_tile(576, spawn_y);
                var tile_right = new Right_foot_tile(640, spawn_y)
                this.current_tilemap.push([tile_left, tile_right]);

                // Ditto
                spawn_y -= 64;
                i++
            }
        }

         // I create the finish line after the loop.
        var finish_left = new Finish_tile(576, spawn_y);
        var finish_right = new Finish_tile(640, spawn_y)
        this.current_tilemap.push([finish_left, finish_right]);
    }

    hardMap() {
        // With this function, the tile_map will harder (and the longest one).
        var length = 100;
        this.total_tiles = length + 1;
        var i = 0;
        var spawn_y = 576;

        // I create the starting line before the loop.
        var starting_left = new Finish_tile(576, spawn_y);
        var starting_right = new Finish_tile(640, spawn_y)
        this.current_tilemap.push([starting_left, starting_right]);

        // The next row of tiles will be above the starting line.
        spawn_y -= 64;

        while (i < length) {
            //Loop to populate the array.
            var spawn_row = spawn_rates();

            if (spawn_row <= 30) {
                // 30% chance of a row with no traps.
                var tile_left = new Left_foot_tile(576, spawn_y);
                var tile_right = new Right_foot_tile(640, spawn_y)
                this.current_tilemap.push([tile_left, tile_right]);

                // Ditto
                i++;
                spawn_y -= 64;

            } else if (spawn_row >= 31 && spawn_row <= 55) {
                // 25% chance of a row with trap in the left side.
                var shock_left = new Shock_trap(576, spawn_y);
                var tile_right = new Right_foot_tile(640, spawn_y)
                this.current_tilemap.push([shock_left, tile_right]);

                // Ditto
                i++;
                spawn_y -= 64;

            } else if (spawn_row >= 56 && spawn_row <= 80) {
                // 25% chance of a row with trap in the right side.
                var tile_left = new Left_foot_tile(576, spawn_y);
                var shock_right = new Shock_trap(640, spawn_y)
                this.current_tilemap.push([tile_left, shock_right]);

                // Ditto
                i++;
                spawn_y -= 64;
                
            } else if (spawn_row >= 81 && spawn_row <= 100) {
                 // 20% chance of a row fully trapped.
                var shock_left = new Shock_trap(576, spawn_y);
                var shock_right = new Shock_trap(640, spawn_y)
                this.current_tilemap.push([shock_left, shock_right]);

                // Ditto
                spawn_y -= 64;
                i++

                /* After a row with traps in both sides is generated, the next row has to be free of traps.
                You have to perform a big jump to surpass this row, and you will land on both feet. Thats why.*/
                var tile_left = new Left_foot_tile(576, spawn_y);
                var tile_right = new Right_foot_tile(640, spawn_y)
                this.current_tilemap.push([tile_left, tile_right]);

                // Ditto
                spawn_y -= 64;
                i++
            }
        }

         // I create the finish line after the loop.
        var finish_left = new Finish_tile(576, spawn_y);
        var finish_right = new Finish_tile(640, spawn_y)
        this.current_tilemap.push([finish_left, finish_right]);

    }

    moveDown() {
        // Move all the tiles to the bottom by one tile (64px), stacking them.
        for (let tileRow of this.current_tilemap) {
            for (let singleTile of tileRow) {
                if (singleTile.position_y <= 640) {
                    singleTile.moveDown();
                    singleTile.updateSVG();
                }
            }
        }
    }

    applyOpacity(posA) {
        /*To give atmosphere to the tile_map, this function takes the parameter posA (current player position)
        and calculates the distance between it and other tiles. The closer they are, the more opaque they are going to be.*/
        
        for (let tileRow of this.current_tilemap) {

            var posB = this.current_tilemap.indexOf(tileRow);
            var distance_Opacity = 1 - Math.abs((posA - posB) / 7);

            for (let singleTile of tileRow) {
                if (posB > posA) {
                    //Above player position
                    singleTile.tile.setAttribute("opacity", distance_Opacity);   
                } else if (posA > posB) {
                    // Behind/Below player position
                    singleTile.tile.setAttribute("opacity", 0.3);   
                } else {
                    // Current player position
                    singleTile.tile.setAttribute("opacity", 1);   
                }  
            }
        }
    }

}

function spawn_rates() {
    // This function is used to generate a random number that will decide which tile will be in each row.
    return Math.floor(Math.random() * 101); 
}

