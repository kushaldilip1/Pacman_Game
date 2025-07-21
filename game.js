/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animations");
const ghostFrames = document.getElementById("ghosts");

let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

let fps = 40;
let oneBlockSize = 20;
let wallColor = "#342DCA";
let wallSpaceWidth = oneBlockSize / 1.7;
let wallOffSet = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "black";
let foodColor = "#FF93CA";
let ghosts = [];
let ghostCount = 4;
let lives = 3;
let foodCount = 0;

let score = 0;
const DIRECTION_RIGHT = 0;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_DOWN = 1;

let gameStarted = false;


let ghostLocations = [
    { x: 0, y: 0 },
    { x: 176, y: 0 },
    { x: 0, y: 121 },
    { x: 176, y: 121 },
];



let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
        if (map[i][j] == 2) {
            foodCount++;
        }
    }
};

let randomTargetsForGhosts = [
    { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
    { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: (map.length - 2) * oneBlockSize },
];

let gameLoop = () => {
    if (gameStarted) {
        draw();
        update();
    }
    else {
        drawStartScreen();
    }
};

let update = () => {
    pacman.moveProcess();
    pacman.eat();
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].moveProcess();
    }

    if (pacman.checkGhostCollision()) {
        console.log("hit");
        restartGame();
    }

    if (score >= foodCount) {
        drawWin();
        clearInterval(gameInterval);
    }

};

let restartGame = () => {
    createNewPacman();
    createGhosts();
    lives--;
    if (lives == 0) {
        gameOver();
    }
};

let gameOver = () => {
    clearInterval(gameInterval);
    drawGameOver();
}

let drawGameOver = () => {
    canvasContext.font = "40px 'Press Start 2P'";
    canvasContext.fillStyle = "red";
    canvasContext.fillText(
        "Game Over", 225, 250,
        oneBlockSize * (map.length + 1) + 10
    );
};

let drawWin = () => {
    canvasContext.font = "50px 'Press Start 2P'";
    canvasContext.fillStyle = "yellow";
    canvasContext.fillText(
        "YOU WON!", 223, 250,
    );
};

let drawLives = () => {
    canvasContext.font = "20px 'Press Start 2P'";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(
        "Lives:" + lives,
        340,
        oneBlockSize * (map.length + 1) + 10
    );
}

let drawFoods = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 2) {
                createRect(
                    j * oneBlockSize + oneBlockSize / 3,
                    i * oneBlockSize + oneBlockSize / 3,
                    oneBlockSize / 3,
                    oneBlockSize / 3,
                    foodColor
                );
            }
        }
    }
};

let drawScore = () => {
    canvasContext.font = "20px 'Press Start 2P'";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(
        "Score:" + score,
        95,
        oneBlockSize * (map.length + 1) + 10
    );
};

let drawGhosts = () => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].draw();
    }
}



let draw = () => {
    createRect(0, 0, canvas.width, canvas.height, "black");
    drawWalls();
    drawFoods();
    pacman.draw();
    drawScore();
    drawLives();
    drawGhosts();
};

let gameInterval = setInterval(gameLoop, 1000 / fps);


let drawWalls = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 1) {        // then it is a wall
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize,
                    oneBlockSize,
                    oneBlockSize,
                    wallColor
                );
                if (j > 0 && map[i][j - 1] == 1) {
                    createRect(
                        j * oneBlockSize,
                        i * oneBlockSize + wallOffSet,
                        wallSpaceWidth + wallOffSet,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }
                if (j < map[0].length - 1 && map[i][j + 1] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffSet,
                        i * oneBlockSize + wallOffSet,
                        wallSpaceWidth + wallOffSet,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }
                if (i > 0 && map[i - 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffSet,
                        i * oneBlockSize,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffSet,
                        wallInnerColor
                    );
                }
                if (i < map.length - 1 && map[i + 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffSet,
                        i * oneBlockSize + wallOffSet,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffSet,
                        wallInnerColor
                    );
                }
            }
        }
    }
};


let createNewPacman = () => {
    pacman = new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize / 5
    );
};

let createGhosts = () => {
    ghosts = []
    for (let i = 0; i < ghostCount; i++) {
        let newGhost = new Ghost(
            9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            pacman.speed / 2,
            ghostLocations[i % 4].x,
            ghostLocations[i % 4].y,
            124,
            116,
            6 + i
        );
        ghosts.push(newGhost);
    }
}

let drawStartScreen = () => {
    createRect(0, 0, canvas.width, canvas.height, "black");
    canvasContext.font = "30px 'Press Start 2P'";
    canvasContext.fillStyle = "yellow";
    canvasContext.textAlign = "center";
    canvasContext.fillText (
        "PACMAN", canvas.width / 2, canvas.height / 2 - 50
    );
    canvasContext.font = "20px 'Press Start 2P'";
    canvasContext.fillStyle = "white";
    canvasContext.fillText ( 
        "Arrows to start", canvas.width / 2, canvas.height / 2 + 60
    );
};

let startGame = () => {
    gameStarted = true;
    score = 0;
    lives = 3;

    foodCount = 0;

    const originalMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

    //Reset the game to original state
    map = originalMap.map(row => [...row]);     //  Deep copy of the map that resets the food count

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j ++) {
            if (map[i][j] === 2) {
                foodCount++;
            }
        }
    }
    createNewPacman();
    createGhosts();
    gameLoop(); 
}







// Implemented the screen buttons here
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');
const upButton = document.getElementById('up-button');
const downButton = document.getElementById('down-button');

//  Adding event listeners for the screen buttons
if (leftButton) {
    leftButton.addEventListener('click', () => {
        if (!gameStarted) {
            startGame();
            return;
        }
        pacman.nextDirection = DIRECTION_LEFT;
    });
}
if (rightButton) {
    rightButton.addEventListener('click', () => {
        if (!gameStarted) {
            startGame();
            return;
        }
        pacman.nextDirection = DIRECTION_RIGHT;
    });
}
if (upButton) {
    upButton.addEventListener('click', () => {
        if (!gameStarted) {
            startGame();
            return;
        }
        pacman.nextDirection = DIRECTION_UP;
    });
}
if (downButton) {
    downButton.addEventListener('click', () => {
        if (!gameStarted) {
            startGame();
            return;
        }
        pacman.nextDirection = DIRECTION_DOWN;
    });
}



// Adding event listeners for keyboard inputs
window.addEventListener("keydown", (event) => {
    if (!gameStarted) {
        startGame();
        return;
    }
    let k = event.key;
    if (k == 'd' || k == 'ArrowRight') {
        pacman.nextDirection = DIRECTION_RIGHT;
    }
    else if (k == 'w' || k == 'ArrowUp') {
        pacman.nextDirection = DIRECTION_UP;
    }
    else if (k == 'a' || k == 'ArrowLeft') {
        pacman.nextDirection = DIRECTION_LEFT;
    }
    else if (k == 's' || k == 'ArrowDown') {
        pacman.nextDirection = DIRECTION_DOWN;
    }
});
