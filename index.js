var PLAY = 1;
var END = 0;
var gameState = PLAY;

var doremon, doremon_running, doremon_collide;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var ratsGroup, rat;
var donutImg, donut;

var score;

var gameOver, restart;


function preload() {
    doremon_running = loadAnimation("Doraemon_red.png");
    doremon_collide = loadAnimation("3.png");
    groundImage = loadImage("brick.jpeg");


    cloudImage = loadImage("cloud.png");
    rat = loadImage("1.png");
    donutImg = loadImage("2.png");

    gameOverImg = loadImage("ove.png");
    restartImg = loadImage("restart.png");

    jumpSound = loadSound("jump.wav");
    dieSound = loadSound("die.wav");
    pointSound = loadSound("1-up.wav");
}

function setup() {
    createCanvas(600, 400);

    doremon = createSprite(50, 10, 20, 40);
    doremon.addAnimation("running", doremon_running);
    doremon.addAnimation("collided", doremon_collide);
    doremon.scale = 0.6;

    donut = createSprite(200, 200);
    donut.addImage("coin", donutImg);
    donut.scale = 0.3;
    donut.velocityX = -5;

    ground = createSprite(250, 495, 400, 20);
    ground.addImage("ground", groundImage);
    ground.x = ground.width / 2;
    ground.velocityX = -5;

    gameOver = createSprite(300, 130);
    gameOver.addImage(gameOverImg);

    restart = createSprite(300, 240);
    restart.addImage(restartImg);

    gameOver.scale = 0.4;
    restart.scale = 0.2;

    gameOver.visible = false;
    restart.visible = false;

    invisibleGround = createSprite(200, 330, 400, 10);
    invisibleGround.visible = false;

    cloudsGroup = new Group();
    ratsGroup = new Group();


    score = 0;
}

function draw() {
    background("#00e6e6");

    fill("black");
    textSize(20);
    text("Score: " + score, 450, 50);

    if (gameState === PLAY) {
        doremon.scale = 0.7;


        if (ratsGroup.isTouching(doremon)) {
            dieSound.play();
            gameState = END;
        }

        if (World.frameCount % 90 === 0) {
            donut = createSprite(400, 50, 40, 10);

            donut.y = Math.round(random(150, 200));
            donut.addImage(donutImg);
            donut.scale = 0.3;
            donut.velocityX = -5;
            donut.lifetime = 134;
        }

        if (keyDown("space") && doremon.y >= 100) {
            jumpSound.play();
            doremon.velocityY = -14;
        }
        doremon.velocityY = doremon.velocityY + 0.8;

        if (ground.x < 0) {
            ground.x = ground.width / 2;
        }

        doremon.collide(invisibleGround);
        spawnClouds();
        spawnObstacles();

        if (donut.isTouching(doremon)) {
            donut.destroy();
            score = score + 2;
        }


        if (score > 0 && score % 100 === 0) {
            pointSound.play();
        }

    } else if (gameState === END) {
        gameOver.visible = true;
        restart.visible = true;

        ground.velocityX = 0;
        doremon.velocityY = 0;
        ratsGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);
        donut.velocityX = 0;


        doremon.changeAnimation("collided", doremon_collide);
        doremon.scale = 0.2;

        ratsGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(1);

        if (mousePressedOver(restart)) {
            reset();
        }
    }
    drawSprites();
}

function spawnClouds() {
    if (frameCount % 60 === 0) {
        var cloud = createSprite(600, 320, 40, 10);
        cloud.y = 100;
        cloud.addImage(cloudImage);
        cloud.scale = 0.1;
        cloud.velocityX = -3;
        cloud.lifetime = 200;

        cloud.depth = doremon.depth;
        doremon.depth = doremon.depth + 1;

        cloudsGroup.add(cloud);
    }

}

function spawnObstacles() {
    if (frameCount % 60 === 0) {
        var obstacle = createSprite(600, 295, 10, 40);
        obstacle.velocityX = -(6 + 3 * score / 100);
        obstacle.addImage(rat);

        obstacle.scale = 0.30;
        obstacle.lifetime = 300;

        ratsGroup.add(obstacle);
    }
}


function reset() {
    gameState = PLAY;
    ground.velocityX = -(6 + 3 * score / 100);
    gameOver.visible = false;
    restart.visible = false;

    ratsGroup.destroyEach();
    cloudsGroup.destroyEach();

    doremon.changeAnimation("running", doremon_running);

    score = 0;
}