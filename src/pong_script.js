// Copyright (C) 2024  blue_dabdidabdae
// full notice in pong.html

var ctx=myCanvas.getContext("2d");
var gameProgress=0;
var gameStatus = 'playing';
var gameInterval;
var aux = Math.random()*(3-(-3))+(-3);

while(aux<1&&aux>-1)
    aux = Math.random()*(3-(-3))+(-3);

if(Math.random()<0.5)
    aux*=-1;

var palla=
{
    raggio: 15,
    x: myCanvas.width/2,
    y: myCanvas.height/2,
    color: "black",
    vx: 2,
    vy: aux
};

var barra1=
{
    width: 20,
    height: 170,
    x: 40,
    y: 300,
    color: "black",
    vy: 2.5*gameProgress,
    direction: "none",
    score: 0
};

var barra2=
{
    width: 20,
    height: 170,
    x: myCanvas.width-60,
    y: 300,
    color: "black",
    vy: 2.5*gameProgress,
    direction: "none",
    score: 0
};

var halfScreen=
{
    width: 3,
    height: myCanvas.height,
    x: myCanvas.width/2-3,
    y: 0,
    color: "black"
};

function resetGame()
{
    gameStatus = 'ended';
    gameProgress=2.0;

    palla.x=myCanvas.width/2;
    palla.y=myCanvas.height/2;
    palla.vx=2;
    aux = Math.random()*(3-(-3))+(-3);
    while(aux<1&&aux>-1)
        aux = Math.random()*(3-(-3))+(-3);
    if(Math.random()<0.5)
        aux*=-1;
    palla.vy=aux;

    barra1.x=40;
    barra1.y=300;
    barra1.vy=2.5*gameProgress;
    barra1.direction="none";

    barra2.x=myCanvas.width-60;
    barra2.y=300;
    barra2.vy=2.5*gameProgress;
    barra2.direction="none";
}

async function delayedGreeting() {
    resetGame();
    disegna(0);
	counter.innerHTML="3";
    await sleep(1000);
    counter.innerHTML="2";
    await sleep(1000);
    counter.innerHTML="1";
    await sleep(1000);
    counter.innerHTML="0";
    await sleep(1000);
    counter.innerHTML="";
    updateSpeed();
    gameStatus = 'playing';
    gameInterval = setInterval(gioco, 1000/120);
    //setInterval(gioco, 1000/120);
}
delayedGreeting();

window.onkeydown = function(event)
{
    if (gameStatus == 'playing')
    {
        if (event.key == 'w' || event.key == 'W') barra1.direction = 'up';
        if (event.key == 's' || event.key == 'S') barra1.direction = 'down';

        if (event.key == 'ArrowUp')   barra2.direction = 'up';
        if (event.key == 'ArrowDown') barra2.direction = 'down';
    }
}

function gioco()
{
    disegna(1);
    aggiorna(1);
}

function disegna(f)
{
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

    ctx.beginPath();
    if(f==1)
    {
        ctx.fillStyle=palla.color;
        ctx.arc(palla.x, palla.y, palla.raggio, 0, 2*Math.PI);
        ctx.fill();
    
        ctx.fillStyle=halfScreen.color;
        ctx.fillRect(halfScreen.x, halfScreen.y, halfScreen.width, halfScreen.height);
    }

    ctx.fillStyle=barra1.color;
    ctx.fillRect(barra1.x, barra1.y, barra1.width, barra1.height);

    ctx.fillStyle=barra2.color;
    ctx.fillRect(barra2.x, barra2.y, barra2.width, barra2.height);
    ctx.stroke();

    playerOne.innerHTML=barra1.score;
    playerTwo.innerHTML=barra2.score;
}

function aggiorna(f)
{
    updateBars();

	if(palla.x-palla.raggio<=0&&f==1)
    {
        barra2.score+=1;
        if(barra2.score==11)
        {
            palla.vx=0;
            palla.vy=0;
            barra1.direction = 'none';
            barra2.direction = 'none';
            gameStatus = 'ended'
            barra2.score = 'WINNER!'
            disegna(1);
            clearInterval(gameInterval);
            return;
        }
        clearInterval(gameInterval);
        delayedGreeting();
        // palla.vx*=-1;
    }
    else if (palla.x+palla.raggio>=myCanvas.width&&f==1)
    {
        barra1.score+=1;
        if(barra1.score==11)
        {
            palla.vx=0;
            palla.vy=0;
            barra1.direction = 'none';
            barra2.direction = 'none';
            gameStatus = 'ended'
            barra1.score = 'WINNER!'
            disegna(1);
            clearInterval(gameInterval);
            return;
        }
        clearInterval(gameInterval);
        delayedGreeting();
        // palla.vx*=-1;
    }
    else if(clipBarra1())
    {
		palla.x=barra1.x+barra1.width+palla.raggio;
        updateSpeed();
		if(Math.random()<0.5)
			palla.vy*=-1;
    }
    else if(clipBarra2())
    {
		palla.x=barra2.x-palla.raggio;
        updateSpeed();
		if(Math.random()<0.5)
			palla.vy*=-1;
        palla.vx*=-1;
    }

    if(palla.y+palla.raggio>=myCanvas.height||palla.y-palla.raggio<=0)
        palla.vy*=-1;
    
    palla.x+=palla.vx;
    palla.y+=palla.vy;

}

function clipBarra1()
{
    return (palla.x-palla.raggio<barra1.x+barra1.width)&&(palla.y-palla.raggio<barra1.y+barra1.height&&palla.y+palla.raggio>barra1.y)&&palla.vx<0;
}

function clipBarra2()
{
    return (palla.x+palla.raggio>barra2.x)&&(palla.y-palla.raggio<barra2.y+barra2.height&&palla.y+palla.raggio>barra2.y&&palla.vx>0);
}

function updateSpeed()
{
    gameProgress=gameProgress+0.1;
    barra1.vy=(2.5*gameProgress/2);
    barra2.vy=(2.5*gameProgress/2);
    palla.vx=(4*gameProgress)/2;
}

function updateBars()
{
    if ((barra1.y <= 0 && barra1.direction == 'up') || (barra1.y+barra1.height >= myCanvas.height && barra1.direction == 'down')) {}
    else if (barra1.direction == 'none') {}
    else if (barra1.direction == 'up') barra1.y -= barra1.vy;
    else if (barra1.direction == 'down') barra1.y += barra1.vy;

    if ((barra2.y <= 0 && barra2.direction == 'up') || (barra2.y+barra2.height >= myCanvas.height && barra2.direction == 'down')) {}
    else if (barra2.direction == 'none') {}
    else if (barra2.direction == 'up') barra2.y -= barra2.vy;
    else if (barra2.direction == 'down') barra2.y += barra2.vy;
}

function premi(event)
{
    console.log(event);
    testo.innerHTML=event.key;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }