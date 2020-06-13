// Class that contains everything related to the player (the arrows indicating where you are in the tilemap)
export class Player {
    constructor() {
        this.game_screen = document.getElementById("game_screen");
        this.player_hover_left = document.createElementNS("http://www.w3.org/2000/svg", "image");
        this.player_hover_right = document.createElementNS("http://www.w3.org/2000/svg", "image");

        // Current position of the arrow in the SVG
        this.position_y = 576;

        //  Attributes player_hover_left (left arrow inside the game)
        this.player_hover_left.setAttribute("href", "assets/hoverplayerleft.gif");
        this.player_hover_left.setAttribute("x", 492);
        this.player_hover_left.setAttribute("y", this.position_y);
        this.player_hover_left.setAttribute("width", 64);
        this.player_hover_left.setAttribute("height", 64);
        this.game_screen.appendChild(this.player_hover_left);


        //  Attributes for player_hover_right (right arrow inside the game)
        this.player_hover_right.setAttribute("href", "assets/hoverplayerright.gif");
        this.player_hover_right.setAttribute("x", 724);
        this.player_hover_right.setAttribute("y", this.position_y);
        this.player_hover_right.setAttribute("width", 64);
        this.player_hover_right.setAttribute("height", 64);
        this.game_screen.appendChild(this.player_hover_right);

        // if true, stop the arrow from moving
        this.set_hover_static = false;

        // Variable that contains in which row the player is standing. Starts at 0.
        this.current_tile_position = 0;

        // String variable to know if the user landed with left/right foot or both feet.
        this.foot_placement = "both";

        /*There is a "hidden" attribute, the opacity. That will indicate with which foot the player has landed.
        I edit this attributes when I call the functions below.*/
        
    }

    bigJump(total_length) {
        //The player does a big jump, jumping two tiles instead of one, and landing with both feet.
        if (this.set_hover_static) {
            // The player has reach the middle of the screen. The arrows wont move.
            this.player_hover_right.setAttribute("opacity", 1);
            this.player_hover_left.setAttribute("opacity", 1);
            this.foot_placement = "both";
        } else {
            // The player is in the starting point or close to the end. The arrows will move closer to the center.
            this.player_hover_right.setAttribute("opacity", 1);
            this.player_hover_left.setAttribute("opacity", 1);
            this.foot_placement = "both";
            
            //Move the arrows up (2 places up out of 10, to be precise).
            this.position_y -= 128

            /*If the big jump surpass the stopping point at the beggining (384px), locks the arrows, set them 
            in the stopping point and returns 1 (a signal for game_engine to perform an action). If it doesnt, the signal
            is not returned.*/
        }

        //Adds two to the "row position"
        this.current_tile_position = this.current_tile_position + 2;
        return(this.unlockHoverConditions(total_length));
    }

    jumpLeft(total_length) {
        //The player does a left jump, landing one tile forward with his left foot.
        if (this.set_hover_static) {
            this.player_hover_right.setAttribute("opacity", 0.3);
            this.player_hover_left.setAttribute("opacity", 1);
            this.foot_placement = "left";
        } else {
            this.player_hover_right.setAttribute("opacity", 0.3);
            this.player_hover_left.setAttribute("opacity", 1);
            this.foot_placement = "left";

            //Move the arrows up (1 place up out of 10, to be precise).
            this.position_y -= 64;
        }

        //Adds one to the "row position"
        ++this.current_tile_position;
        return(this.unlockHoverConditions(total_length));
    }

    jumpRight(total_length) {
        //The player does a right jump, landing one tile forward with his right foot.
        if (this.set_hover_static) {
            this.player_hover_left.setAttribute("opacity", 0.3);
            this.player_hover_right.setAttribute("opacity", 1);
            this.foot_placement = "right";
        } else {
            this.player_hover_left.setAttribute("opacity", 0.3);
            this.player_hover_right.setAttribute("opacity", 1);
            this.foot_placement = "right";

            //Move the arrows up (1 place up out of 10, to be precise).
            this.position_y -= 64;
        }

        //Adds one to the "row position"
        ++this.current_tile_position;
        return(this.unlockHoverConditions(total_length));

    }

    updateSVG() {
        //Update the changes in the SVG.
        this.player_hover_right.setAttribute("y", this.position_y);
        this.player_hover_left.setAttribute("y", this.position_y);
    }

    unlockHoverConditions(total_length) {
        // Limiter when being close to the end.
        var blockPoint = total_length - 6;

        if (this.position_y == 384 && this.current_tile_position == 3) {
            // Single jump or double jump on the tile 3 (first block point). Blocks the arrow on 384px.
            this.set_hover_static = true;
        } else if(this.current_tile_position == blockPoint) {
            // Single jump or double jump on the last block point. Free the arrow.
            this.set_hover_static = false;
        } else if (this.position_y < 384 && this.current_tile_position == 4) {
            // When trying to bigJump over the first block point. Returns special signal.
            this.position_y = 384;
            this.set_hover_static = true;
            return 2;
        } else if (this.current_tile_position == (blockPoint + 1) && this.set_hover_static) {
            // When trying to bigJump over the limit last block point. Returns special signal.
            this.position_y = 320;
            this.set_hover_static = false;
            return 3;
        } else if (this.position_y <= 0 || this.current_tile_position >= total_length) {
            // When trying to bigJump over the end or landing in the finish line. Return special signal
            this.position_y = 0;
            this.current_tile_position = total_length;
            return 4;
        }
    }

}

