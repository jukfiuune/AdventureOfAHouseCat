//setCanvasSize(800, 600);
setFullscreen();

let lvlABack = tryToLoad("lvlABack", "orange");





let myX = 300,
  myY = 300,
  myW = 50,
  myH = 60,
  myDX = 0,
  myDY = 0;

/*let wX = 200,
  wY = 400,
  wW = 200,
  wH = 100;*/

let maxSpeed = 5,
  acceleration = 0.5,
  friction = 1.4,
  gravity = 0.05;
  //gravity/=2

let isOnFloor = false,
  floorChecked = [],
  dashExe = false,
  dashDir = -1,
  dashTime = 0;

let editMode = false,
  lvlData = {collBox:{x:[],y:[],w:[],h:[],stepable:[],created:[],enabled:[]}};

function exportLevelData(){
  return JSON.stringify(lvlData);
}

function importLevelData(iLvlData){
  lvlData = JSON.parse(iLvlData)
}

function update() {
  if(!editMode){
    if (myDX >= -maxSpeed && myDX <= maxSpeed && !dashExe) {
      if (isKeyPressed[key_left] || isKeyPressed[key_a]) {
        myDX -= acceleration;
      } else if (isKeyPressed[key_right] || isKeyPressed[key_d]) {
        myDX += acceleration;
      } else {
        myDX /= friction;
      }
    } else {
      if (myDX < -maxSpeed) {
        myDX = -maxSpeed;
      } else if (myDX > maxSpeed) {
        myDX = maxSpeed;
      }
    }
    if (isOnFloor && !dashExe) {
      if (
        isKeyPressed[16] &&
        (isKeyPressed[32] ||
          isKeyPressed[87] ||
          isKeyPressed[38] ||
          isKeyPressed[key_left] ||
          isKeyPressed[key_a] ||
          isKeyPressed[key_right] ||
          isKeyPressed[key_d])
      ) {
        if (isKeyPressed[key_left] || isKeyPressed[key_a]) {
          dashDir = 0;
        } else if (isKeyPressed[key_right] || isKeyPressed[key_d]) {
          dashDir = 1;
        } else if (isKeyPressed[32] || isKeyPressed[87] || isKeyPressed[38]) {
          dashDir = -1;
        }
        dashExe = true;
      } else if (isKeyPressed[32] || isKeyPressed[87] || isKeyPressed[38]) {
        isOnFloor=false;
        myDY = -5;
        myDY += gravity;
      }
    } else {
      myDY += gravity;
    }
    if (dashExe) {
      myDY = -5;
      dashTime++;
      if (dashTime > 25) {
        if (dashDir == 0) {
          myDX -= 200;
        } else if (dashDir == 1) {
          myDX += 200;
        }
        dashExe = false;
        dashTime = 0;
        dashDir = -1;
      }
    }
    myX += myDX;
    myY += myDY;
    for(let i = 0; i<lvlData.collBox.x.length; i++){
      if (areColliding(myX + 5, myY + myH, myW - 10, 1, lvlData.collBox.x[i], lvlData.collBox.y[i], lvlData.collBox.w[i], lvlData.collBox.h[i])) {
        myY -= myDY;
        myDY = 0;
        //console.log("bottom");
        floorChecked[i]=true
      }
      if (areColliding(myX + 5, myY, myW - 10, 1, lvlData.collBox.x[i], lvlData.collBox.y[i], lvlData.collBox.w[i], lvlData.collBox.h[i])) {
        myY -= myDY;
        myDY = 0;
        //console.log("top");
      }

      if (areColliding(myX, myY + 5, 1, myH - 10, lvlData.collBox.x[i], lvlData.collBox.y[i], lvlData.collBox.w[i], lvlData.collBox.h[i])) {
        myX -= myDX;
        myDX = 0;
        //console.log("left");
      }
      if (areColliding(myX + myW, myY + 5, 1, myH - 10, lvlData.collBox.x[i], lvlData.collBox.y[i], lvlData.collBox.w[i], lvlData.collBox.h[i])) {
        myX -= myDX;
        myDX = 0;
        //console.log("right");
      }
      if(i==lvlData.collBox.x.length-1){
        isOnFloor = false;
        for(let j = 0; j<lvlData.collBox.x.length; j++){
          if(floorChecked[j]){
            isOnFloor=true;
          }
          floorChecked[j]=false;
        }
        myDY += gravity;
      }
    }

  }else{
    if(!lvlData.collBox.created[lvlData.collBox.x.length-1]){
      lvlData.collBox.w[lvlData.collBox.x.length-1]=mouseX-lvlData.collBox.x[lvlData.collBox.x.length-1]
      lvlData.collBox.h[lvlData.collBox.x.length-1]=mouseY-lvlData.collBox.y[lvlData.collBox.x.length-1]
    }
  }
}
function draw() {
  drawImage(lvlABack,0,0)
  context.strokeStyle = "black";
  context.strokeRect(0,0,canvas.width,canvas.height);
  context.fillStyle = "blue";
  for(let i = 0; i<lvlData.collBox.x.length; i++){
    context.strokeStyle = "black";
    context.fillStyle = "blue";
    if(lvlData.collBox.created[i]){
      context.fillRect(lvlData.collBox.x[i], lvlData.collBox.y[i], lvlData.collBox.w[i], lvlData.collBox.h[i]);
    }else{
      context.strokeRect(lvlData.collBox.x[i], lvlData.collBox.y[i], lvlData.collBox.w[i], lvlData.collBox.h[i]);
    }
  }
  if(!editMode){
    context.fillStyle = "blue";
    context.fillRect(myX, myY, myW, myH);

    context.fillStyle = "green";
    context.fillRect(myX + 5, myY + myH, myW - 10, 5);

    context.fillStyle = "red";
    context.fillRect(myX + 5, myY, myW - 10, 5);

    context.fillStyle = "yellow";
    context.fillRect(myX, myY + 5, 5, myH - 10);

    context.fillStyle = "purple";
    context.fillRect(myX + myW, myY + 5, 5, myH - 10);
  }else{
    context.strokeRect(myX, myY, myW, myH);
  }
}

function keyup(key) {
  if(key==73){ //i
    if(editMode){
      editMode = false;
    }else{
      editMode = true;
    }
  }
}

function mouseup() {
  if(editMode){
    if(lvlData.collBox.created[lvlData.collBox.x.length-1]==undefined || lvlData.collBox.created[lvlData.collBox.x.length-1]){
      lvlData.collBox.x.push(mouseX);
      lvlData.collBox.y.push(mouseY);
      lvlData.collBox.w.push(mouseX);
      lvlData.collBox.h.push(mouseY);
      floorChecked.push(false);
      lvlData.collBox.created.push(false);
    }else if(!lvlData.collBox.created[lvlData.collBox.x.length-1]){
      lvlData.collBox.created[lvlData.collBox.x.length-1]=true
    }
  }
}
