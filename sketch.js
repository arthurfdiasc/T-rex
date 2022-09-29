var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var x = 0
var rander = 1

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(windowWidth - 1500,windowHeight - 35,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 1;
  
  ground = createSprite(windowWidth,windowHeight - 35,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.scale = 2
  
   gameOver = createSprite(windowWidth - 900,windowHeight - 450);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(windowWidth - 900,windowHeight -250);
  restart.addImage(restartImg);
  
  gameOver.scale = 2;
  restart.scale = 2;
  
  invisibleGround = createSprite(windowWidth - 1500,windowHeight - 20,400,10);
  invisibleGround.visible = false;
  
  //criar grupos de obstáculos e nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  
  trex.setCollider("circle",0,0,40);
  
  score = 0;
  HighScore = 0;
  
}

function draw() {
  
  background(255);
  //exibindo pontuação
  text(""+ score, windowWidth - 40,windowHeight - 730);
  text("HI:"+ HighScore, windowWidth - 1590, windowHeight - 730)
  
  
   if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //mover o solo
    ground.velocityX = score / 100 * -1 -30;
    //pontuação
    if (frameCount % 3 === 0) {
      score = score + Math.round(score / 2000 + 1);
    }
    if(score >= HighScore)
    {
      HighScore = score;
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //pular quando a tecla espaço for pressionada
    if(touches.lenght > 0 && trex.y >= windowHeight - 100 || keyDown("space") && trex.y >= windowHeight - 100) {
        trex.velocityY = -40;
        jumpSound.play()
        touches = []
    }

    

    if (score % 100 === 0 && score > 0) {
      checkPointSound.play()
    }
    //adicionar gravidade
    if(keyDown("down"))
    {
      trex.velocityY = trex.velocityY + 9.6
    } else {
      trex.velocityY = trex.velocityY + 3.2
    }
    
    x = Math.round((x + rander) + (random(score/800, score/400)))
    
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no chão
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play()
    }
  }
   else if (gameState === END) {
     console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0
     
      //mudar a animação do trex
      trex.changeAnimation("collided", trex_collided);
     
      //definir tempo de vida aos objetos do jogo para que nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     if (keyDown("space") || mousePressedOver(restart) || touches.lenght > 0) {
      obstaclesGroup.destroyEach(0);
      cloudsGroup.destroyEach(0);
      trex.y = 180;
      trex.changeAnimation("running", trex_running);
      score = 0;
      x = 0
      
      gameState = 1;
      touches = []
      
     }
   }
  
 
  //impedir que o trex caia
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (x >= 60){
   var obstacle = createSprite(windowWidth,windowHeight - 60,10,40);
   obstacle.velocityX = Math.round(score / 100 * -1 -30);
   
    //gerar obstáculos aleatórios
    if(score > 300)
    {
    var rand = Math.round(random(1,6));
      } else {
        var rand = Math.round(random(1,5));
      }
    
    
    
    
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
      
    }
    x = 0
   rander = random(2, 3)
    //atribua dimensão e tempo de vida aos obstáculos          
    obstacle.scale = 1;
    obstacle.lifetime = 500;
   //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
     cloud = createSprite(2000,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = Math.random(0.5, 4);
    cloud.velocityX = Math.round(score / 100 * -1 -8);
    
     //atribua tempo de vida à variável
    cloud.lifetime = 500;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvens ao grupo
   cloudsGroup.add(cloud);
    }
}

