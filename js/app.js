// Enemies our player must avoid

class EntityManager {
    constructor(firstRow, lastRow, firstCol, lastCol) {
        this.row = this.constructor.ValidationMixin({lower: firstRow, upper: lastRow});
        this.col = this.constructor.ValidationMixin({lower: firstCol, upper: lastCol});
        this.x = this.constructor.ValidationMixin(this.constructor.xFactory(firstCol, lastCol));
        this.y = this.constructor.ValidationMixin(this.constructor.yFactory(firstRow, lastRow));
    }

    static ValidationMixin(obj) {
        // If it doesn't contain the attribute lower and upper return error
        if (!obj.hasOwnProperty('lower') ||
            !obj.hasOwnProperty('upper')) {
            console.error('ValidationMixin works only on objects with lower and upper attributes');
            return null;
        }

        return Object.assign({}, obj, {
            isValid: function (val) {
                return (val >= obj.lower &&
                    val <= obj.upper);
            },
            getRandomValid: function () {
                return Math.floor(Math.random() * (obj.upper + 1 - obj.lower)) + obj.lower;
            }
        });
    }

    static xFactory(firstCol, lastCol) {
        let xPerCol = 101;
        let xFromCol = (col) => col * xPerCol;

        return {
            lower: xFromCol(firstCol),
            upper: xFromCol(lastCol + 1),
            fromCol: xFromCol
        }
    }

    static yFactory(firstRow, lastRow) {
        let yPerRow = 83, yOffset = 20;
        let yFromRow = (row) => row * yPerRow - yOffset;
        return {
            lower: yFromRow(firstRow),
            upper: yFromRow(lastRow + 1),
            fromRow: yFromRow
        }
    }
}

let enemyManager = (function() {
    let firstStoneRow = 1,lastStoneRow= 3;
    let firstEnemyCol = -1, lastEnemyCol = 4;
    let entityManager = new EntityManager(firstStoneRow, lastStoneRow,
                                    firstEnemyCol, lastEnemyCol);
    let velLevels =  [100, 200, 300, 400, 500];

    function VelLevelFactory() {
        return {
            lower: 0,
            upper: velLevels.length - 1,
            toV: function (velLevel) {
                return velLevels[velLevel];
            }
        }
    }

    return Object.assign({}, entityManager, {
        velLevel: EntityManager.ValidationMixin(VelLevelFactory())
    });
})();

let Enemy = function(row=-1, col=-1, velLevel=-1, randomizeOnReset=true) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    // This is the only time we should have to deal with row, col - after init deal directly with x, y
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
    this.randomizeOnReset = randomizeOnReset;
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.reset = function() {
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

let playerManager = (function() {
    let firstRow = 0,lastRow= 5;
    let firstCol = 0, lastCol = 4;
    let entityManager = new EntityManager(firstRow, lastRow,
                                        firstCol, lastCol);

    return Object.assign({}, entityManager);
})();

class Player {
    constructor() {
        this.col = 2;
        this.row = 5;
        this.x = playerManager.x.fromCol(this.col);
        this.y = playerManager.y.fromRow(this.row);
        this.sprite = 'images/char-boy.png';
    }

    update() {
        this.x = playerManager.x.fromCol(this.col);
        this.y = playerManager.y.fromRow(this.row);
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(dir) {
        switch(dir) {
            case 'left':
                this.col -= 1;
                break;
            case 'up':
                this.row -= 1;
                break;
            case 'right':
                this.col += 1;
                break;
            case 'down':
                this.row += 1;
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
