class Pacman {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.nextDirection = this.direction; // Desired direction from input
        this.currentFrame = 1;
        this.frameCount = 7;

        // This setInterval for animation is okay for now, but often integrated into the main game loop
        setInterval(() => {
            this.changeAnimation();
        }, 100);
    }

    // Helper to get map value at a given pixel coordinate
    getMapValue(x, y) {
        const mapX = Math.floor(x / oneBlockSize);
        const mapY = Math.floor(y / oneBlockSize);

        // Check bounds to prevent errors
        if (mapY >= 0 && mapY < map.length && mapX >= 0 && mapX < map[0].length) {
            return map[mapY][mapX];
        }
        return 1; // Treat out of bounds as a wall
    }

    // Check if a proposed move (x, y) in a given direction would hit a wall
    checkCollision(potentialX, potentialY, direction) {
        let buffer = 5; // A small buffer to prevent sticking to walls

        // Define corners of Pacman's bounding box for collision checking
        let corners = [];
        switch (direction) {
            case DIRECTION_RIGHT:
                corners = [
                    { x: potentialX + this.width - buffer, y: potentialY + buffer },
                    { x: potentialX + this.width - buffer, y: potentialY + this.height - buffer }
                ];
                break;
            case DIRECTION_LEFT:
                corners = [
                    { x: potentialX + buffer, y: potentialY + buffer },
                    { x: potentialX + buffer, y: potentialY + this.height - buffer }
                ];
                break;
            case DIRECTION_UP:
                corners = [
                    { x: potentialX + buffer, y: potentialY + buffer },
                    { x: potentialX + this.width - buffer, y: potentialY + buffer }
                ];
                break;
            case DIRECTION_DOWN:
                corners = [
                    { x: potentialX + buffer, y: potentialY + this.height - buffer },
                    { x: potentialX + this.width - buffer, y: potentialY + this.height - buffer }
                ];
                break;
            case DIRECTION_NONE: // If not moving, no collision from movement
                return false;
            default:
                return false;
        }

        // Check if any corner is inside a wall block
        for (let i = 0; i < corners.length; i++) {
            if (this.getMapValue(corners[i].x, corners[i].y) === 1) {
                return true; // Collision detected
            }
        }
        return false; // No collision
    }

    moveProcess() {
        let newX = this.x;
        let newY = this.y;

        // Try to change direction if a new direction is requested
        if (this.nextDirection !== this.direction && this.nextDirection !== DIRECTION_NONE) {
            let tempX = this.x;
            let tempY = this.y;

            // Calculate potential position if moving in the nextDirection
            if (this.nextDirection === DIRECTION_RIGHT) {
                tempX += this.speed;
            } else if (this.nextDirection === DIRECTION_LEFT) {
                tempX -= this.speed;
            } else if (this.nextDirection === DIRECTION_UP) {
                tempY -= this.speed;
            } else if (this.nextDirection === DIRECTION_DOWN) {
                tempY += this.speed;
            }

            // Only change direction if the next step in the requested direction is NOT a wall
            if (!this.checkCollision(tempX, tempY, this.nextDirection)) {
                this.direction = this.nextDirection;
            }
        }

        // Calculate potential new position based on current direction
        if (this.direction === DIRECTION_RIGHT) {
            newX += this.speed;
        } else if (this.direction === DIRECTION_LEFT) {
            newX -= this.speed;
        } else if (this.direction === DIRECTION_UP) {
            newY -= this.speed;
        } else if (this.direction === DIRECTION_DOWN) {
            newY += this.speed;
        }

        // Check for collision at the calculated new position
        if (!this.checkCollision(newX, newY, this.direction)) {
            this.x = newX;
            this.y = newY;
            this.eat(); // Call eat after successful move
        } else {
            // If collided, stop moving in that direction
            this.direction = DIRECTION_NONE;
        }
    }


    eat() {
        const currentMapX = Math.floor((this.x + this.width / 2) / oneBlockSize);
        const currentMapY = Math.floor((this.y + this.height / 2) / oneBlockSize);

        // Ensure currentMapY and currentMapX are within map bounds
        if (currentMapY >= 0 && currentMapY < map.length &&
            currentMapX >= 0 && currentMapX < map[0].length) {
            if (map[currentMapY][currentMapX] === 2) {
                map[currentMapY][currentMapX] = 0; // Remove pellet
                // You can add score increment here later
            }
        }
    }





    // Original checkCollision is replaced by the more robust one above
    // checkCollision() { } // Commented out to avoid confusion


    checkGhostCollision() { }


    // changeDirectionIfPossible logic is now integrated into moveProcess
    // changeDirectionIfPossible() { } // Commented out to avoid confusion


    changeAnimation() {
        this.currentFrame = this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    }


    draw() {
        canvasContext.save();
        canvasContext.translate (
            this.x + oneBlockSize / 2,
            this.y + oneBlockSize / 2
        );
        canvasContext.rotate((this.direction * 90 * Math.PI) / 100);

        canvasContext.translate (
            -this.x - oneBlockSize / 2,
            -this.y - oneBlockSize / 2
        );

        canvasContext.drawImage(
            pacmanFrames, 
            (this.currentFrame - 1) * oneBlockSize,
            0, 
            oneBlockSize, 
            oneBlockSize, 
            this.x,
            this.y, 
            this.width, 
            this.height
        );

        canvasContext.restore();
        

        // Original sprite drawing code (commented out for now as it relies on numeric directions for rotation)
        // canvasContext.save();
        // canvasContext.translate (
        //     this.x + oneBlockSize / 2,
        //     this.y + oneBlockSize / 2
        // );
        // // This rotation needs to be adjusted if DIRECTION_ is string
        // // canvasContext.rotate((this.direction * 100 * Math.PI) / 100);

        // canvasContext.translate (
        //     -this.x - oneBlockSize / 2,
        //     -this.y - oneBlockSize / 2
        // );

        // canvasContext.drawImage(
        //     pacmanFrames,
        //     (this.currentFrame - 1) * oneBlockSize,
        //     0,
        //     oneBlockSize,
        //     oneBlockSize,
        //     this.x,
        //     this.y,
        //     this.width,
        //     this.height
        // );

        // canvasContext.restore();
    }


    getMapX() {
        return parseInt(this.x / oneBlockSize)
    }

    getMapY() {
        return parseInt(this.y / oneBlockSize)
    }

    getMapXRightSide() {
        return parseInt((this.x + 0.9999 * oneBlockSize) / oneBlockSize)
    }

    getMapYRightSide() {
        return parseInt((this.y + 0.9999 * oneBlockSize) / oneBlockSize)
    }
}