//board
let board,context;
let w=360,h=450;

//headout plane
let bW=50,bH=25,bX=bW/2,bY=4*bH;

//buildings
let item=[];
let mW=130,mH=250,mX=w,mY=140;
let bottomMount; 

//clouds
let cW=130,cH=90,cX=w,cY=40;
let topCloud;

//physics
let velocityX=-2,velocityY=0,gravity=0.43;
let gameOver=false;
let score=0; 

let plane={
    x:bX, y:bY, width:bW, height:bH
}
window.onload=function(){
    board=document.getElementById("board");
    board.height=h;
    board.width=w;
    context=board.getContext("2d");

    planeImg=new Image();
    planeImg.src="./plane.png";
    planeImg.onload=function(){
        context.drawImage(planeImg,plane.x,plane.y,plane.width,plane.height);
    }

    topCloud=new Image();
    topCloud.src="./cloud.png";

    bottomMount=new Image();
    bottomMount.src="./building.png";

    board.addEventListener("touchstart", touchStart);
    board.addEventListener("touchend", touchEnd);
    board.addEventListener("touchstart", function () {
        if (gameOver) {
            plane.y=bY;
            item=[];
            score=0;
            gameOver=false;          
        }
    });
    requestAnimationFrame(update);
    setInterval(placeItems,1750);
    document.addEventListener("keydown", movePlane);
}

function update(){
    requestAnimationFrame(update);
    if (gameOver) return;
    context.clearRect(0,0,board.width,board.height);

    //plane
    velocityY+=gravity;
    plane.y=Math.max(plane.y+velocityY,-10);
    context.drawImage(planeImg,plane.x,plane.y,plane.width,plane.height);

    if (plane.y>board.height) gameOver=true; 
    //items
    let sc=0;
    for (let i=0;i<item.length;i++){
        let obs=item[i];
        obs.x+=velocityX;
        context.drawImage(obs.img,obs.x,obs.y,obs.width,obs.height);

        if (!obs.passed && plane.x> obs.x + obs.width/2){
            score+=0.5;
            obs.passed=true;
        }
        if (detectCollision(plane,obs)){
            gameOver=true;
        }
    }

    //score
    context.fillStyle = "rgba(91,161,192,255)";
    context.font="50px sans-serif";
    context.fillText(score,5,50);

    if (gameOver){
        context.fillText("GAME OVER",5,100);
        context.font="30px sans-serif";
        context.fillText("Press X to restart",65,250);
    }
}
function placeItems(){
    if (gameOver) return;
    let randomY = Math.random()*160;
    let cloud={
        img:topCloud, x:cX, y:randomY, width:cW, height:cH, passed:false
    }
    item.push(cloud);

    let mountain= {
        img:bottomMount, x:mX, y:mY+randomY+cH, width:mW, height:mH, passed:false
    }
    item.push(mountain);
}
 function movePlane(e){
    if (e.code=="Space" || e.code=="ArrowUp" || e.code=="KeyX"){
        velocityY=-6;
    };
    if (gameOver){
        if(e.code=="KeyX"){
            plane.y=bY;
            item=[];
            score=0;
            gameOver=false;
        }
    }
 }

 function detectCollision(a,b){
     return a.x + 10 < b.x + b.width &&
            a.x + a.width - 15 > b.x &&
            a.y + 15 < b.y + b.height &&
            a.y + a.height - 5 > b.y
 }
 function touchStart() {
    if (!gameOver) {
        velocityY = -6; // Move the plane upward
    }
}
function touchEnd() {
    if (!gameOver) {
        velocityY = -4; // Stop upward movement, or you can adjust it as needed
    }
}