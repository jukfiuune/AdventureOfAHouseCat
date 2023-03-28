/////////////////////
/////PISHTOV 2.0/////
/////////////////////


///////////////////
/////FUNCTIONS/////
///////////////////

// distance(x1, y1, x2, y2);                    - distance between two points

// getTriangleArea(x1, y1, x2, y2, x3, y3);     - area of a triangle

// isInTriangle(pX, pY, x1, y1, x2, y2, x3, y3);- is P in triangle

// isInHexagon(cX, cY, strana, pX, pY);         - is P in hexagon

// traceHexagonPath(cX, cY, strana);            - fill the path of a hexagon
// Use with context.fill() or context.stroke();

// pauseUpdate();                               - pauses the update function
// Use ONLY IN update/keyup/mouseup/draw() { .. }

// startUpdate();                               - start the update function
// Use ONLY IN update/keyup/mouseup/draw() { .. }

// isUpdatePaused();                            - is the update paused or not

// setCanvasSize(width, height);                - change size of canvas

// setFullscreen();                             - set the canvas to fullscreen



///////////////////
/////TEST GAME/////
///////////////////

setCanvasSize(800, 600);

function update() {
    console.log("Update");
}
function draw() {
    // Draw mouse cursor
    context.beginPath();
    context.arc(mouseX, mouseY, 20, 0, 2*Math.PI);
    context.fill();
    
    // Draw screen borders
    context.strokeRect(0, 0, canvas.width, canvas.height);
}

function keyup(key) {
    // when SPACE pressed - pause/unpause game
    if(key == 32) {
        if(isUpdatePaused()) {
            // Start update repeating
            startUpdate(); 
        } else {
            // Stop update repeating
            pauseUpdate();
        }
    }
}

function mouseup() {
	console.log(mouseX, mouseY);
}
