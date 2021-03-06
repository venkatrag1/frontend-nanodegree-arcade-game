
class Modal {
 // Modal to show when player wins
  constructor(overlay) {
    this.overlay = overlay;
    const closeButton = overlay.querySelector('.button-close');
    closeButton.addEventListener('click', this.close.bind(this));
    overlay.addEventListener('click', e => {
      if (e.srcElement.id === this.overlay.id) {
        this.close();
      }
    });
  }
  open() {
    this.overlay.classList.remove('is-hidden');
  }
  close() {
    this.overlay.classList.add('is-hidden');
  }
}

const modal = new Modal(document.querySelector('.modal-overlay'));

class EntityManager {
    // Class that provides constraints for various attributes of entity
    constructor(firstRow, lastRow, firstCol, lastCol) {
        // Make it easy to access constraints for corresponding attributes of entity using dot accessor
        this.row = this.constructor.ValidationMixin({lower: firstRow, upper: lastRow});
        this.col = this.constructor.ValidationMixin({lower: firstCol, upper: lastCol});
        this.x = this.constructor.ValidationMixin(this.constructor.xFactory(firstCol, lastCol));
        this.y = this.constructor.ValidationMixin(this.constructor.yFactory(firstRow, lastRow));
    }

    static ValidationMixin(obj) {
        /* Validation Mixin acts on an object that has lower and upper attributes, and extends them with isValid
        and getRandomValid methods */
        if (!obj.hasOwnProperty('lower') ||
            !obj.hasOwnProperty('upper')) {
            console.error('ValidationMixin works only on objects with lower and upper attributes');
            return null;
        }

        return Object.assign({}, obj, {
            isValid: function (val) {
                // Check if given value lies in the range of lower and uppper allowed values
                return (val >= obj.lower &&
                    val <= obj.upper);
            },
            getRandomValid: function () {
                // Return a random value from within the valid range
                return Math.floor(Math.random() * (obj.upper + 1 - obj.lower)) + obj.lower;
            }
        });
    }

    static xFactory(firstCol, lastCol) {
        // Factory object to generate lower, upper and given x values from corresponding column values
        let xPerCol = 101;
        let xFromCol = (col) => col * xPerCol;

        return {
            lower: xFromCol(firstCol),
            upper: xFromCol(lastCol + 1),
            fromCol: xFromCol
        };
    }

    static yFactory(firstRow, lastRow) {
        // Factory object to generate lower, upper and given y values from corresponding row values
        let yPerRow = 83, yOffset = 20;
        let yFromRow = (row) => row * yPerRow - yOffset;
        return {
            lower: yFromRow(firstRow),
            upper: yFromRow(lastRow + 1),
            fromRow: yFromRow
        };
    }
}

let enemyManager = (function() {
    // Instance formed by extending EntityManager class for enemy
    let firstStoneRow = 1,lastStoneRow= 3;
    let firstEnemyCol = -1, lastEnemyCol = 4;
    let entityManager = new EntityManager(firstStoneRow, lastStoneRow,
                                    firstEnemyCol, lastEnemyCol);
    let velLevels =  [100, 200, 300, 400, 500];

    function VelLevelFactory() {
        // Factory object to generate a velocity value from the pre-programmed choices given a velocity level
        return {
            lower: 0,
            upper: velLevels.length - 1,
            toV: function (velLevel) {
                return velLevels[velLevel];
            }
        };
    }

    return Object.assign({}, entityManager, {
        velLevel: EntityManager.ValidationMixin(VelLevelFactory())
    });
})();

let Enemy = function(row=-1, col=-1, velLevel=-1, randomizeOnReset=true) {

    // This is the only time we should have to deal with row, col for enemy- after init deal directly with x, y
    if (!enemyManager.row.isValid(row)) {
        row = enemyManager.row.getRandomValid();
    }
    if (!enemyManager.col.isValid(col)) {
        col = enemyManager.col.lower;
    }
    if (!enemyManager.velLevel.isValid(velLevel)) {
       velLevel = enemyManager.velLevel.getRandomValid();
    }

    this.x = enemyManager.x.fromCol(col);
    this.y = enemyManager.y.fromRow(row);
    this.v = enemyManager.velLevel.toV(velLevel);
    this.randomizeOnReset = randomizeOnReset; // Hook for testing by initializing with same position and velocity
    this.sprite = 'images/enemy-bug.png';
    this.height = 10;
    this.width = 10;
};

Enemy.prototype.reset = function() {
    // Reset enemy to -1 grid to appear gradually
    this.x = enemyManager.x.lower;
    if (this.randomizeOnReset === true) {
        this.v = enemyManager.velLevel.toV(enemyManager.velLevel.getRandomValid());
    }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (!enemyManager.x.isValid(this.x)) {
        this.reset();
    } else {
        // distance travelled = velocity * time
        this.x += this.v * dt;
        this.checkCollisions();
    }
};

Enemy.prototype.checkCollisions = function() {
    // http://blog.sklambert.com/html5-canvas-game-2d-collision-detection/#d-collision-detection
    //
    let enemyWidth = 80;
    let enemyHeight = 10;
    let playerWidth = 80;
    let playerHeight = 10;

    // debugger // For figuring out logical values for width and height
    if (player.x < (this.x + enemyWidth) &&
        (player.x + playerWidth) > this.x &&
        player.y < (this.y + enemyHeight) &&
        (player.y + playerHeight) > this.y) {
        player.reset();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

let playerManager = (function() {
    // Instance of EntityManager class for player
    let firstRow = 0,lastRow= 5;
    let firstCol = 0, lastCol = 4;
    let entityManager = new EntityManager(firstRow, lastRow,
                                        firstCol, lastCol);

    return Object.assign({}, entityManager);
})();

class Player {
    constructor() {
        this.reset();
        this.sprite = 'images/char-boy.png';
        this.height = 10;
        this.width = 10;
    }

    update() {
        this.x = playerManager.x.fromCol(this.col);
        this.y = playerManager.y.fromRow(this.row);
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }


    updateRow(newRow) {
        // If you reach the top, game is won
        if (newRow === playerManager.row.lower) {
            resetGame();
            return;
        }
        // Bound movements to box in all other directions
        if (playerManager.row.isValid(newRow)) {
            this.row = newRow;
        }
    }

    updateCol(newCol) {
        // Bound movements in all other directions
        if (playerManager.col.isValid(newCol)) {
            this.col = newCol;
        }
    }

    reset() {
        // Always reset player to middle column in last row
        this.col = 2;
        this.row = 5;
        this.x = playerManager.x.fromCol(this.col);
        this.y = playerManager.y.fromRow(this.row);
    }

    handleInput(dir) {
        switch(dir) {
            case 'left':
                this.updateCol(this.col - 1);
                break;
            case 'up':
                this.updateRow(this.row - 1);
                break;
            case 'right':
                this.updateCol(this.col + 1);
                break;
            case 'down':
                this.updateRow(this.row + 1);
                break;
        }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [];

for (let row = 1; row <= 3; row++) {
    allEnemies.push(new Enemy(row=row));
}

let player = new Player();

function resetGame() {
    //allEnemies.prototype.forEach( function(currentEnemy) {currentEnemy.reset()}); //  Not necessary
    modal.open();
    player.reset();
}

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
