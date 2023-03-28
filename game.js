setCanvasSize(800, 600);

let myX = 300,
    myY = 300,
    myW = 50,
    myH = 60,
    myDX = 0,
    myDY = 0;

let wX = 200,
    wY = 400,
    wW = 200,
    wH = 100;

let maxSpeed = 5, acceleration = 0.5, friction = 1.4, gravity = 0.05;

let isOnFloor = false;

function update() {
    if(myDX >= -maxSpeed && myDX <= maxSpeed) {
        if(isKeyPressed[key_left] || isKeyPressed[key_a]) {
            myDX -= acceleration;
        } else if(isKeyPressed[key_right] || isKeyPressed[key_d]) {
            myDX += acceleration;
        } else {
            myDX/=friction;
        }
    } else {
        if(myDX < -maxSpeed) {
            myDX = -maxSpeed;
        } else if(myDX > maxSpeed) {
            myDX = maxSpeed;
        }
    }
    myDY += gravity;    
    myX += myDX;
    myY += myDY;
    if(areColliding(myX + 5, myY + myH, myW - 10, 1, wX, wY, wW, wH)) {
        myY -= myDY;
        myDY = 0;
        console.log("bottom");
        isOnFloor = true
    }else{
        isOnFloor = false
    }
    if(areColliding(myX + 5, myY, myW - 10, 1, wX, wY, wW, wH)) {
        myY -= myDY;
        myDY = 0;
        console.log("top");
    }
    
    if(areColliding(myX, myY + 5, 1, myH - 10, wX, wY, wW, wH)) {
        myX -= myDX;
        myDX = 0;
        console.log("left");
    }
    if(areColliding(myX + myW, myY + 5, 1, myH - 10, wX, wY, wW, wH)) {
        myX -= myDX;
        myDX = 0;
        console.log("right");
    }
}
function draw() {

    context.fillStyle = "blue";
    context.fillRect(myX, myY, myW, myH);
    context.fillRect(wX, wY, wW, wH);

    context.fillStyle = "green";
    context.fillRect(myX + 5, myY + myH, myW - 10, 5);
    
    context.fillStyle = "red";
    context.fillRect(myX + 5, myY, myW - 10, 5);
    
    context.fillStyle = "yellow";
    context.fillRect(myX, myY + 5, 5, myH - 10);
    
    context.fillStyle = "purple";
    context.fillRect(myX + myW, myY + 5, 5, myH - 10);
}

function keydown(key) {
    if((key == 32 || key == 87 || key == 38) && isOnFloor) {
        myDY = -5;
    }
}

function mouseup() {
}
