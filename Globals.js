
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

var screen_size = new Vector(800, 600);
var map_size = new Vector(5000, 5000);
var frame_rate = 30;
var thisGame = 0;
var currPlayer = 0;
// shorthand variable for the current player
var p = 0;
