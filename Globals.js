
function Vector(x, y){
	this.x = x;
	this.y = y;
}

function Rect(x, y, w, h){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}


function intersectRect(r1, r2) {
  return !(r2.x > r1.x + r1.w || 
           r2.w + r2.x < r1.x || 
           r2.y > r1.y + r1.h ||
           r2.y + r2.h  < r1.y);
}

var screen_size = new Vector(800, 600);
var map_size = new Vector(5000, 5000);
var frame_rate = 30;
var thisGame = 0;
var currPlayer = 0;
// shorthand variable for the current player
var p = 0;
