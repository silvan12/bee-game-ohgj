const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const score_element = document.getElementById("score");

var score = 0;

function lose() {
    alert(`You lose! You got ${score} points`);
    window.location.reload();
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        this.x += other.x;
        this.y += other.y;
    }

    dist(other) {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }
}

const beeTexture = new Image();
beeTexture.src = "bee.png";

const flowerTexture = new Image();
flowerTexture.src = "flower.png";

const spikeTexture = new Image();
spikeTexture.src = "spike.png";

class Bee {
    constructor() {
        this.pos = new Vector(-canvas.width / 2, 0);
        this.vel = new Vector(4.5, 0);
    }

    draw() {
        context.drawImage(beeTexture, this.pos.x + cam.x, this.pos.y + cam.y);
    }

    update() {
        this.vel.y += 0.5;
        this.pos.add(this.vel);

        if (this.pos.x >= canvas.width / 2 - beeTexture.width && this.vel.x > 0) {
            this.vel.x *= -1;
            beeTexture.src = "bee2.png";
        } else if (this.pos.x <= -canvas.width / 2 && this.vel.x < 0) {
            this.vel.x *= -1;
            beeTexture.src = "bee.png";
        }

        if (this.pos.y >= canvas.height - cam.y + beeTexture.height) {
            lose();
        }
        
        // collision with top
        if (this.pos.y <= -cam.y - 7.5) {
            this.vel.y *= -0.1;
        }
    }
}

class Obstacle {
    constructor(pos, isFlower) {
        this.pos = pos;
        this.texture = isFlower ? flowerTexture : spikeTexture;
        this.isFlower = isFlower;
    }

    draw() {
        context.drawImage(this.texture, this.pos.x + cam.x, this.pos.y + cam.y);
    }

    update() {
        if (this.pos.dist(bee.pos) <= this.texture.width / 2) {
            if (!this.isFlower) {
                lose();
            } else {
                score += 50;
            }

            obstacles = obstacles.filter((elem) => {
                return elem != this;
            });
        }


    }
}

const bee = new Bee();
const cam = new Vector(canvas.width / 2, canvas.height / 2);
var obstacles = [];

var frame = 0;

function loop() {
    draw();
    update();

    frame++;
    if (frame % 100 == 0 && Math.random() < 0.75) {
        obstacles.push(new Obstacle(new Vector(Math.random() * (canvas.width - flowerTexture.width) - canvas.width / 2, -cam.y - flowerTexture.height), Math.random() < 0.7));
    }

    if (frame % 10 == 0) {
        score++;
    }

    score_element.innerHTML = score;
    setTimeout(loop, 1 / 120 * 1000);
    
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    bee.draw();

    obstacles.forEach(flower => {
        flower.draw();
    });
}

function update() {
    bee.update();
    cam.y += 1;

    obstacles.forEach(flower => {
        flower.update();
    });
}

// on space press
document.onkeydown = function (e) {
    if (e.code == "Space") {
        bee.vel.y = -10;
    }
}

loop();
