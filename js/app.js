// Enemies our player must avoid

let Enemy = function(row=-1, col=-1, velLevel=-1) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    if (!GameBoard.enemyRow.isValid(row)) {
        row = GameBoard.enemyRow.getRandomValid();
    }
    if (!GameBoard.col.isValid(col)) {
        col = GameBoard.col.getRandomValid();
    }
    if (!GameBoard.velLevel.isValid(velLevel)) {
        velLevel = GameBoard.velLevel.getRandomValid();
    }

    this.x = GameBoard.col.toX(col);
    this.y = GameBoard.enemyRow.toY(row);
    this.v = GameBoard.velLevel.toVelocity(velLevel);
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (!GameBoard.x.isValid(this.x)) {
        this.x = GameBoard.x.lowerLimit;
        this.v = GameBoard.velLevel.toVelocity(GameBoard.velLevel.getRandomValid());
    } else {
        this.x += this.v * dt;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

class Player {
    constructor() {
        this.sprite = 'images/char-boy.png';
    }

    update() {

    }

    render() {

    }

    handleInput(dir) {
        console.log(dir);
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [new Enemy(row=2), new Enemy(row=3)];
let player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
