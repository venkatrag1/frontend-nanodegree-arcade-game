// Enemies our player must avoid

class EntityManager {
    constructor(firstRow, lastRow, firstCol, lastCol) {
        this.row = this.constructor.RowMixin(this.constructor.ValidationMixin({}, firstRow, lastRow));
        this.col = this.constructor.ColMixin(this.constructor.ValidationMixin({}, firstCol, lastCol));
        this.x = this.constructor.ValidationMixin({}, -101, 505);
        this.y = this.constructor.ValidationMixin({}, 0, 606);
    }

    static ValidationMixin(obj, lowerLimit, upperLimit) {
        return Object.assign({}, obj, {
            lowerLimit: lowerLimit,
            upperLimit: upperLimit,
            isValid: function (val) {
                return (val >= lowerLimit &&
                    val <= upperLimit);
            },
            getRandomValid: function () {
                return Math.floor(Math.random() * (upperLimit + 1 - lowerLimit)) + lowerLimit;
            }
        });
    }

    static RowMixin(obj) {
        let rowMultiplier = 83;
        let yFloor = 20;
        return Object.assign({}, obj, {
            toY: function (row) {
                return row * rowMultiplier - yFloor;
            }
        });
    }

    static ColMixin(obj) {
        let colMultiplier = 101;
        return Object.assign({}, obj, {
            toX: function (col) {
                return col * colMultiplier;
            }
        });
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
            toV: function (velLevel) {
                return velLevels[velLevel];
            }
        }
    }

    return Object.assign({}, entityManager, {
        //velLevel: this.constructor.ValidationMixin(VelLevelFactory(), 0, velLevels.length - 1)
        velLevel: VelLevelFactory()
    });
})();
//
// let GameBoard = (function () {
//     let maxX= 505, maxY = 606;
//     let numRows = 6, numCols = 5;
//     let firstStoneRow = 1,lastStoneRow= 3;
//     let rowMultiplier = 83, colMultiplier = 101;
//     let yFloor = 20;
//     let velLevels =  [100, 200, 300, 400, 500];
//
//     function Validation(lowerLimit, upperLimit) {
//         this.lowerLimit = lowerLimit;
//         this.upperLimit = upperLimit;
//         this.isValid = function (val) {
//             return (val >= this.lowerLimit &&
//                 val <= this.upperLimit);
//         };
//         this.getRandomValid = function () {
//             return Math.floor(Math.random() * (this.upperLimit + 1 - this.lowerLimit)) + this.lowerLimit;
//         };
//     }
//
//     function ColConversion(colObj) {
//         return Object.assign({}, colObj, {
//             toX: function (col) {
//                 return col * colMultiplier;
//             }
//         });
//     }
//
//     function RowConversion(rowObj) {
//         return Object.assign({}, rowObj, {
//             toY: function (row) {
//                 return row * rowMultiplier - yFloor;
//             }
//         });
//     }
//
//     function VelConversion(velLevelObj) {
//         return Object.assign({}, velLevelObj, {
//             toVelocity: function (velLevel) {
//                 return velLevels[velLevel];
//             }
//         });
//     }
//
//     return {
//         playerRow: RowConversion(new Validation(0, numRows-1)),
//         enemyRow: RowConversion(new Validation(firstStoneRow, lastStoneRow)),
//         col: ColConversion(new Validation(-1, numCols-1)),
//         velLevel: VelConversion(new Validation(0, velLevels.length - 1)),
//         x: new Validation(-101, maxX),
//         y: new Validation(0, maxY)
//     }
//
// })();

let Enemy = function(row=-1, col=-1, velLevel=-1, randomizeOnReset=true) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    if (!enemyManager.row.isValid(row)) {
        row = enemyManager.row.getRandomValid();
    }
    if (!enemyManager.col.isValid(col)) {
        col = enemyManager.col.lowerLimit;
    }
    //if (!enemyManager.velLevel.isValid(velLevel)) {
    //    velLevel = enemyManager.velLevel.getRandomValid();
    //}
    velLevel = 1;

    this.x = enemyManager.col.toX(col);
    this.y = enemyManager.row.toY(row);
    this.v = enemyManager.velLevel.toV(velLevel);
    this.randomizeOnReset = randomizeOnReset;
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.reset = function() {
    this.x = enemyManager.col.toX(enemyManager.col.lowerLimit);
    if (this.randomizeOnReset === true) {
        //this.v = enemyManager.velLevel.toV(enemyManager.velLevel.getRandomValid());
        this.v = enemyManager.velLevel.toV(1);
    }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (!enemyManager.x.isValid(this.x)) {
        debugger
        this.reset();
    } else {
        debugger
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
