//Create variables here

var gameState = "START";

var player;
var PlayerAnimation;
var idlePlayerImage;
var idlePlayer;

var ground;
var groundImage;

var invisibleGround;

var bg;

var count = 0;
var obstacle1Image;
var obstacle2Animation;
var obstacle3Animation;
var OBGroup;

var startButton;
var startButtonImage;
var gameOver;
var gameOverImage;
var restart;
var restartImage;
var welcome;
var welcomeImage;

var coin1, coin2, coin3;
var coinBar = 0;
var coinGroup;

//sounds;
var afterdying;
var coin;
var jump;
var resetButtonClick;
var spawnSound;
var startButtonClick;
var themeSong;
var loseSound;

var txt;
var goal;

var info;
var infoImage;

var backButton;
var backButtonImage;

var home;
var homeImage;

function preload() {
  //load images here
  playerAnimation = loadAnimation(
    "images/run outline-0.png",
    "images/run outline-1.png",
    "images/run outline-2.png",
    "images/run outline-3.png",
    "images/run outline-4.png",
    "images/run outline-5.png",
    "images/run outline-6.png",
    "images/run outline-7.png"
  );

  groundImage = loadImage("images/ground.png");
  bg = loadImage("images/bg.png");

  startButtonImage = loadImage("images/start.png");
  idlePlayerImage = loadImage("images/idle outline-4.png");

  obstacle1Image = loadImage("images/obstacle1.png");
  obstacle2Animation = loadAnimation(
    "images/obstacle2 (1).png",
    "images/obstacle5.png"
  );
  obstacle3Animation = loadAnimation(
    "images/obstacle3.png",
    "images/obstacle4.png"
  );

  restartImage = loadImage("images/restart.png");
  gameOverImage = loadImage("images/gameOver.png");
  welcomeImage = loadImage("images/welcome.png");

  coin1 = loadImage("images/coin1.png");
  coin2 = loadImage("images/coin2.png");
  coin3 = loadImage("images/coin3.png");

  afterdying = loadSound("sounds/afterDying.mp3");
  coin = loadSound("sounds/coin.mp3");
  jump = loadSound("sounds/jump.mp3");
  resetButtonClick = loadSound("sounds/resetButtonClick.mp3");
  spawnSound = loadSound("sounds/spawnSound.mp3");
  startButtonClick = loadSound("sounds/startButtonClick.mp3");
  themeSong = loadSound("sounds/themeSong.mp3");
  loseSound = loadSound("sounds/lose.mp3");

  infoImage = loadImage("images/info.png");
  backButtonImage = loadImage("images/back.png");
  homeImage = loadImage("images/Home.png");
}

function setup() {
  createCanvas(800, 600);
  player = createSprite(100, 430, 50, 50);
  player.addAnimation("running", playerAnimation);
  player.scale = 4.3;

  idlePlayer = createSprite(100, 433, 50, 50);
  idlePlayer.addImage(idlePlayerImage);
  idlePlayer.scale = 4.3;

  ground = createSprite(400, 580, width, 50);
  ground.addImage(groundImage);
  ground.scale = 0.5;
  ground.x = ground.width / 4;

  invisibleGround = createSprite(400, 518, width, 10);
  invisibleGround.visible = false;

  startButton = createSprite(width / 2, height / 2 + 10, 20, 20);
  startButton.addImage(startButtonImage);
  startButton.scale = 0.4;
  startButton.visible = false;

  restart = createSprite(width / 2, 330, 50, 50);
  restart.addImage(restartImage);
  restart.scale = 0.4;
  restart.visible = false;

  gameOver = createSprite(width / 2, height / 2 - 100, 50, 50);
  gameOver.addImage(gameOverImage);
  gameOver.visible = false;

  welcome = createSprite(width / 2, height / 2 - 130, 50, 50);
  welcome.addImage(welcomeImage);
  welcome.scale = 0.4;
  welcome.visible = false;

  OBGroup = new Group();
  coinGroup = new Group();

  txt = "Press P To Play Music";
  txt.visible = false;

  goal = "Reach the Golden Idol if you dare";
  goal.visible = false;

  info = createSprite(760, 40, 50, 50);
  info.addImage(infoImage);
  info.scale = 0.8;
  info.visible = false;

  backButton = createSprite(100, 500, 50, 50);
  backButton.addImage(backButtonImage);
  backButton.scale = 0.9;
  backButton.visible = false;

  home = createSprite(400, 50, 50, 50);
  home.addImage(homeImage);
  home.visible = false;
}

function draw() {
  background(bg);

  if (gameState === "START") {
    home.visible = false;
    backButton.visible = false;
    info.visible = true;
    player.visible = false;
    startButton.visible = true;
    ground.velocityX = 0;
    if (mousePressedOver(startButton)) {
      startButtonClick.play();
      gameState = "PLAY";
    }

    if (mousePressedOver(info)) {
      gameState = "INFO";
    }
    fill(rgb(255, 180, 230));
    textSize(45);
    textFont("georgia");
    text("Score: " + count, 50, 70);
    text("Coins: " + coinBar, 500, 70);
  }

  if (gameState === "PLAY") {
    home.visible = true;

    backButton.visible = false;
    info.visible = false;
    if (count > 100) {
      goal.visible = false;
    }
    welcome.visible = false;
    startButton.visible = false;
    idlePlayer.visible = false;
    player.visible = true;
    ground.velocityX = -(7 + (1 * count) / 100);
    if (keyDown("space") && player.y >= 430) {
      jump.play();
      player.velocityY = -18;
    }
    player.velocityY = player.velocityY + 1;
    if (ground.x < 100) {
      ground.x = ground.width / 4;
    }
    count = count + Math.round(getFrameRate() / 60);
    createObstacles();
    createCoins();

    if (keyWentUp("p")) {
      themeSong.loop();
    }

    if (mousePressedOver(home)) {
      OBGroup.destroyEach();
      coinGroup.destroyEach();
      coinBar = 0;
      count = 0;
      player.visible = false;
      idlePlayer.visible = true;
      if (themeSong.isPlaying() && mousePressedOver(home)) {
        themeSong.stop();
      }
      gameState = "START";
    }

    if (OBGroup.isTouching(player)) {
      themeSong.stop();
      gameState = "END";
      loseSound.play();
      afterdying.loop();
    }
    fill(rgb(255, 180, 230));
    textSize(45);
    textFont("georgia");
    text("Score: " + count, 50, 70);
    text("Coins: " + coinBar, 500, 70);
  }

  if (gameState === "END") {
    gameOver.visible = true;
    restart.visible = true;
    player.visible = false;
    idlePlayer.visible = true;
    ground.velocityX = 0;
    OBGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    OBGroup.setLifetimeEach(-1);
    coinGroup.destroyEach();
    player.velocityY = 0;
    if (mousePressedOver(restart)) {
      resetButtonClick.play();
      reset();
      afterdying.stop();
    }

    fill(rgb(255, 180, 230));
    textSize(45);
    textFont("georgia");
    text("Score: " + count, 50, 70);
    text("Coins: " + coinBar, 500, 70);
  }

  if (player.isTouching(coinGroup)) {
    coin.play();
    coinGroup.destroyEach();
    coinBar++;
  }

  player.collide(invisibleGround);

  if (gameState === "INFO") {
    player.visible = false;
    idlePlayer.visible = false;
    welcome.visible = false;
    startButton.visible = false;
    ground.visible = false;

    // I have to add text here

    fill("red");
    textSize(30);
    text("Hellow World", 100, 200);
    info.visible = false;
    backButton.visible = true;
    if (mousePressedOver(backButton)) {
      idlePlayer.visible = true;
      welcome.visible = true;
      startButton.visible = true;
      ground.visible = true;
      gameState = "START";
    }
  }

  drawSprites();

  //add styles here

  if (gameState === "START") {
    // text("Welcome");
    welcome.visible = true;
    textSize(32);
    text(txt, 260, 470);
  }

  if (gameState === "PLAY" && count < 100) {
    goal.visible = true;
    textSize(45);
    strokeWeight(7);
    textFont("georgia");
    fill("green");
    text(goal, 80, 200);
  }
}

function createObstacles() {
  if (frameCount % 45 === 0) {
    var obstacle = createSprite(820, 480, 10, 10);
    obstacle.velocityX = -(13 + (2 * count) / 100);
    var rand = Math.round(random(1, 3));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1Image);
        break;

      case 2:
        obstacle.addAnimation("obgA", obstacle2Animation);
        break;

      case 3:
        obstacle.addAnimation("obg2", obstacle3Animation);
        break;

      default:
        break;
    }
    obstacle.scale = 0.4;
    obstacle.lifetime = 400;
    invisibleGround.depth = obstacle.depth;
    invisibleGround.depth = invisibleGround.depth + 1;

    OBGroup.add(obstacle);
  }
}

function reset() {
  gameState = "PLAY";
  gameOver.visible = false;
  restart.visible = false;
  OBGroup.destroyEach();
  idlePlayer.visible = false;
  player.visible = true;
  count = 0;
  coinBar = 0;
  spawnSound.play();
}

function createCoins() {
  if (frameCount % 150 === 0) {
    var coins = createSprite(800, 300, 20, 20);
    coins.velocityX = -7;
    var rand = Math.round(random(1, 3));

    switch (rand) {
      case 1:
        coins.addImage(coin1);
        break;

      case 2:
        coins.addImage(coin2);
        break;

      case 3:
        coins.addImage(coin3);
        break;

      default:
        break;
    }
    coins.scale = 1;
    coins.lifetime = 400;
    //adjusted the depth of the player and coins
    player.depth = coins.depth;
    player.depth = player.depth + 1;
    coinGroup.add(coins);
  }
}
