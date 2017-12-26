var BASE_HEIGHT = 83, BASE_WIDTH = 101;

// 设置标志符，当游戏结束时，屏蔽按键功能
var flag = false;


// 这是我们的玩家要躲避的敌人 
var Enemy = function(x,y,speed) {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    this.x = x;
    this.y = y;
    this.speed = speed;

    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    if (!flag) {
        return;
    };

    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    if (this.x < BASE_WIDTH * 5) {
        this.x += dt * this.speed * 50;
    } else {
        this.x = - BASE_WIDTH;
        this.y = getRandomInt(1, 3) * BASE_HEIGHT - 10;
        this.speed = getRandomInt(2, 6);
    }
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    // 设置游戏画板透明度，如果Game over，则将游戏面板置灰
    if (!player.isLive) {
        ctx.globalAlpha = 0.5;
    } else {
        ctx.globalAlpha = 1;
    };

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// // 实现碰撞检测
// Enemy.prototype.checkCollisions = function(player) {
//     var xDistance = Math.abs(this.x - player.x);
//     if (this.y === player.y && xDistance < 101) {
//         console.log("Game over!");
//         if (xDistance === 0) {
//             player.x = 202;
//             player.y = 83 * 4 + 55;
//         };
//     } else {
//         console.log("Player save");
//     }
// }

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
}

Player.prototype.update = function(dt) {

};



// 此为游戏必须的函数，用来在屏幕上画出玩家，
Player.prototype.render = function() {
    if (!player.isLive) {
        ctx.globalAlpha = 0.5;
    } else {
        ctx.globalAlpha = 1;
    };
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 设置玩家是否存活
Player.prototype.isLive = true;

// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
Player.prototype.handleInput = function (keyCode) {
    if (flag) {
        if (keyCode == 'left' && this.x > 0) {
            this.x -= BASE_WIDTH;
        } else if (keyCode == 'up' && this.y > 0) {
            this.y -= BASE_HEIGHT;
        } else if (keyCode == 'right' && this.x < BASE_WIDTH * 4) {
            this.x += BASE_WIDTH;
        } else if (keyCode == 'down' && this.y < BASE_HEIGHT * 5) {
            this.y += BASE_HEIGHT;
        }
    } else {
        if (keyCode == 'space') {
            buttonClick();
        }
    }
};

$(document).keydown(function (event) {
    //if (event.keyCode == "down" || event.keyCode == "up")
    event.preventDefault();
})
// 设置玩家死亡以后归位
Player.prototype.reset = function() {
    ctx.globalAlpha = 1;
    flag = true;
    player.isLive = true;
    player.x = BASE_WIDTH * 2;
    player.y = BASE_HEIGHT * 5;
};

//加载游戏图片，确定初始位置
var Game = function (sprite, x, y) {
    Enemy.call(this, sprite, x, y);
};
var game = new Game('images/char-boy.png', 505, 505);
Game.prototype.render = function () {
    if (!player.isLive) {
        ctx.fillStyle = "gray";
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0,50,505,538);
    }
    if (player.y === 0) {
        ctx.font = "52pt Impact";
        ctx.textAlign = "center";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.fillStyle = "black";
        ctx.fillText("YOU WIN!!", 252, 403);
        ctx.strokeText("YOU WIN!!", 252, 403);
        flag = false;
        document.getElementById("start_button").innerText = "再来一次";
        ctx.textAlign = "center";
        ctx.drawImage(Resources.get('images/Star.png'), 202, 153);
    }
    if (player.isLive == false) {
        ctx.globalAlpha = 1;
        ctx.font = "52pt Impact";
        ctx.textAlign = "center";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.fillStyle = "black";
        ctx.fillText("GAME OVER!!", 252, 303);
        ctx.strokeText("GAME OVER!!", 252, 303);
        flag = false;
        document.getElementById("start_button").innerText = "再来一次";
    }
};

//获得随机数
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
var allEnemies = [];
for (var i = 0; i <= 5; i++) {
    var enemy = new Enemy(- BASE_WIDTH, getRandomInt(1, 3) * BASE_HEIGHT - 20, getRandomInt(2, 6));
    allEnemies.push(enemy);
}

var player = new Player(BASE_WIDTH * 2, BASE_HEIGHT * 5);


// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'space'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

function buttonClick() {
    if (flag) {
        flag = false;
        document.getElementById("start_button").innerText = "开始游戏";
    } else {
        document.getElementById("start_button").innerText = "暂停";
        player.reset();
    }
}