//setCanvasSize(800, 600);
setFullscreen();

let lvlA = tryToLoad("lvlA", "orange"),
  lvlBDoor = tryToLoad("lvlBDoor", "pink"),
  lvlBNDoor = tryToLoad("lvlBNDoor", "pink"),
  lvlC = tryToLoad("lvlC", "blue"),
  lvlCDark = tryToLoad("lvlCDark", "grey"),
  lvlCDarkConsole = tryToLoad("lvlCDarkConsole", "grey");

let cat = [[],[],[],[],[],[],[],[],[],[],[],[],[]];

for (i=0;i<16;i++){
  cat[0][i]=tryToLoad("cat[0]["+i+"]","grey");
}
for (i=0;i<3;i++){
  cat[1][i]=tryToLoad("cat[1]["+i+"]","grey");
}
for (i=0;i<3;i++){
  cat[2][i]=tryToLoad("cat[2]["+i+"]","grey");
}
for (i=0;i<4;i++){
  cat[3][i]=tryToLoad("cat[3]["+i+"]","grey");
}
for (i=0;i<6;i++){
  cat[4][i]=tryToLoad("cat[4]["+i+"]","grey");
}
for (i=0;i<6;i++){
  cat[5][i]=tryToLoad("cat[5]["+i+"]","grey");
}
for (i=0;i<16;i++){
  cat[6][i]=tryToLoad("cat[6]["+i+"]","grey");
}
for (i=0;i<3;i++){
  cat[7][i]=tryToLoad("cat[7]["+i+"]","grey");
}
for (i=0;i<3;i++){
  cat[8][i]=tryToLoad("cat[8]["+i+"]","grey");
}
for (i=0;i<4;i++){
  cat[9][i]=tryToLoad("cat[9]["+i+"]","grey");
}
for (i=0;i<6;i++){
  cat[10][i]=tryToLoad("cat[10]["+i+"]","grey");
}
for (i=0;i<6;i++){
  cat[11][i]=tryToLoad("cat[11]["+i+"]","grey");
}





let myX = 300,
  myY = 400,
  myW = 120,
  myH = 60,
  myDX = 0,
  myDY = 0;

let cameraX=0;

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
  lvlData = {collBox:{x:[],y:[],w:[],h:[],stepable:[],created:[],enabled:[], deadly:[]}};
let typeAni=0, frameAni=0, cooldownAni=0, flipAni = 1;

function exportLevelData(){
  return JSON.stringify(lvlData);
}

function importLevelData(iLvlData){
  //lvlData = JSON.parse(iLvlData)
  lvlData = iLvlData
}

importLevelData(lvlAData)

function update() {
  if(!editMode){
    if (myDX >= -maxSpeed && myDX <= maxSpeed && !dashExe) {
      if (isKeyPressed[key_left] || isKeyPressed[key_a]) {
        myDX -= acceleration;
        if(flipAni == 1){
          flipAni = 0;
        }
        if(cooldownAni==0){
          frameAni++
          cooldownAni++
        }else if(cooldownAni>2){
          cooldownAni=0
        }else{
          cooldownAni++
        }
        if(frameAni>cat[typeAni].length-1){
          frameAni=0;
        }
      } else if (isKeyPressed[key_right] || isKeyPressed[key_d]) {
        myDX += acceleration;
        if(flipAni == 0){
          flipAni = 1;
        }
        if(cooldownAni==0){
          frameAni++
          cooldownAni++
        }else if(cooldownAni>2){
          cooldownAni=0
        }else{
          cooldownAni++
        }
        if(frameAni>15){
          frameAni=0;
        }
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
    cameraX += myDX;
    myY += myDY;
    for(let i = 0; i<lvlData.collBox.x.length; i++){
      if (areColliding(myX + 5, myY + myH, myW - 10, 1, lvlData.collBox.x[i], lvlData.collBox.y[i], lvlData.collBox.w[i], lvlData.collBox.h[i])) {
        myY -= myDY;
        myDY = 0;
        //console.log("bottom");
        floorChecked[i]=true
        if(lvlData.collBox.deadly[i]){
          myX=300;
          myY=400;
          cameraX = 0;
        }
      }
      if (areColliding(myX + 5, myY, myW - 10, 1, lvlData.collBox.x[i], lvlData.collBox.y[i], lvlData.collBox.w[i], lvlData.collBox.h[i])) {
        myY -= myDY;
        myDY = 0;
        //console.log("top");
        if(lvlData.collBox.deadly[i]){
          myX=300;
          myY=400;
          cameraX = 0;
        }
      }

      if (areColliding(myX, myY + 5, 1, myH - 10, lvlData.collBox.x[i], lvlData.collBox.y[i], lvlData.collBox.w[i], lvlData.collBox.h[i])) {
        myX -= myDX;
        cameraX -= myDX;
        myDX = 0;
        //console.log("left");
        if(lvlData.collBox.deadly[i]){
          myX=300;
          myY=400;
          cameraX = 0;
        }
      }
      if (areColliding(myX + myW, myY + 5, 1, myH - 10, lvlData.collBox.x[i], lvlData.collBox.y[i], lvlData.collBox.w[i], lvlData.collBox.h[i])) {
        myX -= myDX;
        cameraX -= myDX;
        myDX = 0;
        //console.log("right");
        if(lvlData.collBox.deadly[i]){
          myX=300;
          myY=400;
          cameraX = 0;
        }
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
      lvlData.collBox.w[lvlData.collBox.x.length-1]=mouseX-lvlData.collBox.x[lvlData.collBox.x.length-1]+cameraX
      lvlData.collBox.h[lvlData.collBox.x.length-1]=mouseY-lvlData.collBox.y[lvlData.collBox.x.length-1]
    }
  }
}
function draw() {
  drawImage(lvlA,0-cameraX,0);
  //drawImage(lvlCDarkBack,0-cameraX,0);
  context.strokeStyle = "black";
  context.strokeRect(0,0,canvas.width,canvas.height);
  context.fillStyle = "blue";
  for(let i = 0; i<lvlData.collBox.x.length; i++){
    if(lvlData.collBox.deadly[i]){
      context.fillStyle = "red";
      context.strokeStyle = "red";
    }else{
      context.fillStyle = "blue";
      context.strokeStyle = "blue";
    }
    if(lvlData.collBox.created[i]){
      context.fillRect(lvlData.collBox.x[i]-cameraX, lvlData.collBox.y[i], lvlData.collBox.w[i], lvlData.collBox.h[i]);
    }else{
      context.strokeRect(lvlData.collBox.x[i]-cameraX, lvlData.collBox.y[i], lvlData.collBox.w[i], lvlData.collBox.h[i]);
    }
  }
  if(!editMode){
    //context.fillStyle = "blue";
    //context.fillRect(myX-cameraX, myY, myW, myH);
    if(flipAni==0){
      drawImage(cat[typeAni+6][frameAni],myX-cameraX-20, myY-20, myW+40, myH+20);
    }else{
      drawImage(cat[typeAni][frameAni],myX-cameraX-10, myY-20, myW+40, myH+20);
    }
    /*if(!alreadyFlipped){
      context.translate(myX+myW+40, 0);
      context.scale(-1, 1);
      alreadyFlipped=true
    }*/

    context.fillStyle = "green";
    context.fillRect(myX + 5-cameraX, myY + myH, myW - 10, 5);

    context.fillStyle = "red";
    context.fillRect(myX + 5-cameraX, myY, myW - 10, 5);

    context.fillStyle = "yellow";
    context.fillRect(myX-cameraX, myY + 5, 5, myH - 10);

    context.fillStyle = "purple";
    context.fillRect(myX + myW-cameraX, myY + 5, 5, myH - 10);
  }else{
    context.strokeStyle = "black";
    context.strokeRect(myX-cameraX, myY, myW, myH);
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
  if(key==84){
    if(!lvlData.collBox.created[lvlData.collBox.x.length-1]){
      if(lvlData.collBox.deadly[lvlData.collBox.x.length-1]){
        lvlData.collBox.deadly[lvlData.collBox.x.length-1]=false
        console.log(lvlData.collBox.deadly[lvlData.collBox.x.length-1])
      }else{
        lvlData.collBox.deadly[lvlData.collBox.x.length-1]=true
      }
    }
  }
}

function mouseup() {
  if(editMode){
    if(lvlData.collBox.created[lvlData.collBox.x.length-1]==undefined || lvlData.collBox.created[lvlData.collBox.x.length-1]){
      lvlData.collBox.x.push(mouseX+cameraX);
      lvlData.collBox.y.push(mouseY);
      lvlData.collBox.w.push(mouseX+cameraX);
      lvlData.collBox.h.push(mouseY);
      lvlData.collBox.deadly.push(false);
      floorChecked.push(false);
      lvlData.collBox.created.push(false);
    }else if(!lvlData.collBox.created[lvlData.collBox.x.length-1]){
      lvlData.collBox.created[lvlData.collBox.x.length-1]=true
    }
  }
}

/*function onscroll() {
  if(!lvlData.collBox.created[lvlData.collBox.x.length-1]){
    if(lvlData.collBox.deadly[lvlData.collBox.x.length-1]){
      lvlData.collBox.deadly[lvlData.collBox.x.length-1]=false
    }else{
      lvlData.collBox.deadly[lvlData.collBox.x.length-1]=true
    }
  }
}*/
