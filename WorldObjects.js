/*
 * This file holds declartions of classes representing objects in the world.
 * This includes map bariers, structures and units.
 *
 */

function WorldObject(x, y, radius){
	this.loc = new Vector(x,y);
	this.radius = radius;
}

// different drawings of decorations (for building nice looking stuff)
var LEFT = 0, RIGHT = 1, TOP = 2, BOTTOM = 3, BOTTOM_LEFT = 4, BOTTOM_RIGHT = 5, 
	TOP_LEFT = 6, TOP_RIGHT = 7, CENTER = 8, LEFT_BOTTOM_CORNER = 9, RIGHT_BOTTOM_CORNER = 10,
	LEFT_TOP_CORNER = 11, RIGHT_TOP_CORNER = 12;

/*
			   6----2----7
		       |		 |
			   0         1
			   |         |
		6--2--11		 12--2--7
		|                       |
		0                       1
		|                       |
		4--3---9         10--3--5
		       |         |
			   4-----3---5
*/

//different types of decorations

var KELP = 1, ROCK = 2, CORAL = 3, CREVICE = 4;	
var KELP_PICS, ROCK_PICS, CORAL_PICS, CREVICE_PICS;
var ALL_TERRAIN = new Array( KELP_PICS, ROCK_PICS, CORAL_PICS, CREVICE_PICS );
var TERRAIN_FILES = new Array ( "kelp", "rock", "coral", "crevice" );

for (var j = 0; j < CREVICE; j++){
	ALL_TERRAIN[j] = new Array();
	for (var i = 0; i <= CENTER; i++){
		ALL_TERRAIN[j][i] = new Image();
		ALL_TERRAIN[j][i].src = TERRAIN_FILES[j] + i + ".png";
	}
}

function drawWorldObject(obj, ctx, player, game, color){
	if ( ! (player.origin.x - obj.radius < obj.loc.x &&
			player.origin.x + screen_size.x + obj.radius > obj.loc.x &&
			player.origin.y - obj.radius < obj.loc.y &&
			player.origin.y + screen_size.y + obj.radius > obj.loc.y) ) {
		//return;
	}

	ctx.fillStyle = obj.player.color;
	ctx.fillRect( obj.loc.x - obj.radius - player.origin.x, obj.loc.y - obj.radius - player.origin.y, obj.radius * 2, obj.radius * 2 );

	var selection_rad = 2;
	if (obj.selected == true){
		ctx.strokeStyle = "rgb(200, 50, 200)";
		ctx.strokeRect( obj.loc.x - obj.radius - player.origin.x - selection_rad, obj.loc.y - obj.radius - player.origin.y - selection_rad,
				obj.radius * 2 + selection_rad * 2, obj.radius * 2 + selection_rad * 2);
	}
}

function MapDecoration(x, y, radius, type){
	this.loc = new Vector(x, y);
	this.radius = radius;
	this.type = type;

	this.draw = function(ctx, game){
		
	}

	this.get_images() = function() {
		
	}

	this.update = function(time){
		// for right now these will all be static
	}
}

function Player(x_origin, y_origin, color){
	this.energy = 0;
	this.kelp = 0;
	this.color = color;
	this.origin = new Vector(x_origin, y_origin);
	this.mouse_pos = new Vector(0,0);
	this.units = new Array();
	this.selection = new Rect(-1,-1, 10, 10);
	this.selection_status = new Vector(-10,-10);
}

// types of units
var WORKER = 1, CRAB_ATTACKER = 2, FISH_ATTACKER = 3;

// values for unit functions
var GATHERER = 1, MELEE = 2, DISTANCE = 3;

// values for locomotion
var GROUND = 1, SWIMMING = 2;

function Unit(x, y, radius, locomotion, type, func, player){
	this.loc = new Vector(x, y);
	this.type = type;
	this.func = func;
	this.player = player;
	this.radius = radius;
	this.selected = false;

	this.draw = function(ctx, game, player){
		drawWorldObject(this, ctx, player, game, player.color);
	}

	this.collision_rect = function(){
		return new Rect(this.loc.x - this.radius, this.loc.y - this.radius, 2 * this.radius, 2 * this.radius);
	}
	
	this.update = function(){

	}
}

