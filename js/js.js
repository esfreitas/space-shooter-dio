
const conteiner = document.querySelector('.conteiner');
let points = 0;
let lifes = 3;
let level = 1;
let velocidade = 30;
createScore();
createLifes();
const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['/img/monster-1.png', '/img/monster-2.png', '/img/monster-3.png'];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
let alienInterval;





function refreshPoints(){
    document.querySelector('.score').innerHTML = `Level ${level} Pontos: ${points}`; 
}

function refreshLifes(){
    document.querySelector('.lifes').innerHTML = `Vidas: ${lifes}`; 
}




//Movimentos e disparo
function flyShip(event){
    if(event.key === 'ArrowUp'){
        event.preventDefault();
        moveUp();
    }else if(event.key === 'ArrowDown'){
        event.preventDefault();
        moveDown();
    }else if(event.key === ' '){
        event.preventDefault();
        fireLaser();
    }

}

//função subir
function moveUp(){
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if(topPosition ==="0px"){
        return;
    }else{
        let position = parseInt(topPosition);
        position -=25;
        yourShip.style.top = `${position}px`;
    }
}


//função descer
function moveDown(){
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');

    if(topPosition ==="500px"){
        return;
    }else{
        let position = parseInt(topPosition);
        position +=25;
        yourShip.style.top = `${position}px`;
    }
}

//Funcionalidade de tiro
function fireLaser(){
    let laser = createLaserElement();
    playArea.appendChild(laser);
    moveLaser(laser, points);
}

function createLaserElement(){
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src = '/img/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 10}px`;
    return newLaser;
}



function moveLaser(laser){
    let laserInterval = setInterval(()=>{
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien)=>{ // comparando se cada alien foi atingido para trocar a src da imagem
            if(checkLaserCollision(laser, alien)){
                alien.src ='/img/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
                laser.remove();
                points = points + 10;
                refreshPoints();     
                
                if(points === level * 50){
                    levelUp()
                }         
            }              
        })


        if (xPosition === 340){
            laser.remove();
        }else{
            laser.style.left = `${xPosition + 8}px`
        }

    }, 10);
}

//Funão para criar inimigos aleatórios
function createAliens(){
    let newAlien = document.createElement('img');
    let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)]; // Sorteio de imagens
    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '370px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}


//Função para movimentar os inimigos
function moveAlien(alien){
    let moveAlienInterval = setInterval(()=>{
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        if (xPosition <= 50){
            if(Array.from(alien.classList).includes('dead-alien')){
                alien.remove();
            }else if(lifes === 0){
                gameOver();
            }else{
                lifes = lifes - 1; 
                refreshLifes();
                alien.remove();
            }
        }else{
            alien.style.left = `${xPosition - 4}px`;
        }

    }, velocidade);
}

//Função para colisão
function checkLaserCollision(laser, alien){
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20;

    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 68;

    if(laserLeft!=340 && laserLeft + 40 >=alienLeft){
        if(laserTop <= alienTop && laserTop >= alienBottom){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }


}


//inicio do jogo

startButton.addEventListener('click', (event) => {
    playGame();
})


function playGame(){
    startButton.style.display='none';
    instructionsText.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    alienInterval = setInterval(()=>{
        createAliens();
    }, 2000);
}


//função level up 
function levelUp(){

    level ++;
    velocidade = velocidade - 2;

    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    alert(`Passou para o nível ${level}, pontuação atual ${points}`);

    setTimeout(()=>{
        yourShip.style.top = '250px';
        startButton.style.display = 'block';
        instructionsText.style.display ='block';
    });

    refreshPoints();

}

//função game over

function gameOver(){
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    alert(`Game Over, você chegou ao nível ${level}, pontuação ${points}`);

    setTimeout(()=>{
        yourShip.style.top = '250px';
        startButton.style.display = 'block';
        instructionsText.style.display ='block';
    });

    points = 0;
    lifes = 3;
    level = 1;
    refreshPoints();
    refreshLifes();
}

//Funão para criar o placar de pontos
function createScore(){
    let newScore = document.createElement('div');
    newScore.style.color = 'white';
    newScore.innerHTML = `Level ${level} Pontos: ${points}`;
    newScore.classList.add('score');
    newScore.style.left = '30%';
    newScore.style.top = '30px';
    conteiner.appendChild(newScore);
}

//Funão para criar o placar de vidas
function createLifes(){
    let newLifes = document.createElement('div');
    newLifes.style.color = 'white';
    newLifes.innerHTML = `${lifes}`;
    newLifes.classList.add('lifes');
    newLifes.style.left = '70%';
    newLifes.style.top = '30px';
    conteiner.appendChild(newLifes);
}





