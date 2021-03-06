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
	// two dimensional array with a series of groups of units that are
	// moving together, a unit should only ever be in one of the groups
	this.movement_groups = new Array();
}

// types of units
var WORKER = 1, CRAB_ATTACKER = 2, FISH_ATTACKER = 3;

// values for attack type
var MELEE = 2, DISTANCE = 3;

// values for locomotion
var WALKER = 1, SWIMMER = 2;

// values for unit state
var IDLE = 1, MOVING = 2, PATROLLING = 3, ATTACKING = 4, MOVE_TO_ATTACK = 5;

// adjusting to do the flocking while moving every tick causes jitter, only apply it
// every few ticks
var FLOCKING_TIMER = 5;

/*
 * Units will need to share some functionality, ability to move, attack and other state changes.
 * Will want to have a standard API for them to comunicate with the other elements of the game,
 * collision detection, delivering damage, impacting elements of the terrain/resources.
 *
 * Unit features/states:
 * Shared by all units of same type, assume updates apply to existing units instantly:
 *      - attack damage (my have multiple attack types for one unit)
 *      - defense/shield value
 *      - max health
 *      - ability to gather resources
 *      - ability to attack walkers, swimmers or both
 * 
 * unique to a paricular instance of a unit:
 *      - current health
 *      - current state : moving, attacking, gathering, etc.
 *          - almost always has an associated 'target' area or entity
 *      - current position
 *      - animation state (hopefully all handled in UI/rendering)
 *          - might need to speed up overall animation for quicker attacking
 *          - need to sync game/unit state changes like damage with the animation
 */
		
function Unit(x, y, radius, locomotion, type, attack_type, player){
	this.loc = new Vector(x, y);
    this.state = IDLE;
	this.target = false;
	this.type = type;
	this.attack_type = attack_type;
	this.player = player;
	this.radius = radius;
	this.selected = false;
	this.movement_group = false;
	this.clustering_timer = 0;
	this.velocity = false;

	this.draw = function(ctx, game, player){
		drawWorldObject(this, ctx, player, game, player.color);
	}

	this.collision_rect = function(){
		return new Rect(this.loc.x - this.radius, this.loc.y - this.radius, 2 * this.radius, 2 * this.radius);
	}
	
	this.update = function(){

		speed = 1;
		disable_normal_movement = false;
		// move away from other units
		p = this.player;	
		if ( this.state == MOVING || this.state == MOVE_TO_ATTACK) {
			this.set_velocity();
			this.clustering_timer++;
			if (this.clustering_timer % 20 % 2 == 0) {
				// boid flocking algorithm
				// http://gamedevelopment.tutsplus.com/tutorials/the-three-simple-rules-of-flocking-behaviors-alignment-cohesion-and-separation--gamedev-3444
		
				obstacle_avoidance = new Vector(0,0);
				// loop through all world objects
				// this would definitely be a good candidate for better performance collision detection 
				
				cumulative_direction = new Vector(0,0);
				center_of_mass = new Vector(0,0);
				neighbor_distance = new Vector(0,0);
				// making adjustments towards/away from neighbors every tick causes jitter
					
				for (var j = 0; j < this.movement_group.length; j++){
					unit = this.movement_group[j];
					//if (this == unit)
						//continue;
					// hit a group member that is idle, stop moving
					if (distance(unit.loc, this.loc) < 50) {
						if (unit.state == IDLE) {
							this.go_idle();
							return;
						}
						cumulative_direction.add(unit.velocity);
						center_of_mass.add(unit.loc)
						neighbor_distance.x += unit.loc.x - this.loc.x;
						neighbor_distance.y += unit.loc.y - this.loc.y;
					}
				}
				if (this.movement_group.length > 1 ) {
					cumulative_direction.scale( 1.0 / (this.movement_group.length));
					center_of_mass.scale( 1.0 / (this.movement_group.length));
					neighbor_distance.scale( 1.0 / (this.movement_group.length));
					neighbor_distance.normalize();
					center_of_mass.x -= this.loc.x;
					center_of_mass.y -= this.loc.y;
				}
				cumulative_direction.normalize();
				center_of_mass.normalize();
				center_of_mass.scale(0.8)
				neighbor_distance.scale(2);
				flock_adjustment = new Vector(0,0);
				flock_adjustment.x = neighbor_distance.x + cumulative_direction.x - center_of_mass.x;
				flock_adjustment.y += neighbor_distance.y + cumulative_direction.y - center_of_mass.y;
				if (flock_adjustment.mag() > 0.2) {
					this.velocity.x += flock_adjustment.x;
					this.velocity.y += flock_adjustment.y;
				}
			}
			this.velocity.normalize();
			this.velocity.x *= speed;
			this.velocity.y *= speed;

			if (! disable_normal_movement ) {
				dist = this.move(this.target, -1, 2);
				// update for reached destination
				if (dist < 10) {
					this.go_idle();
				}
			}
		}
	}

	this.go_idle = function() {
		this.state = IDLE;
		this.velocity.x = 0;
		this.velocity.y = 0;
		this.target = false;
	}

	this.move_to = function(dest) {
		this.state = MOVING;
		this.target = new Vector(dest.x, dest.y);
		this.velocity = false;
		this.clustering_timer = FLOCKING_TIMER;
		this.set_velocity();
	}
	
	this.move_towards = function(entity, speed) {
		return this.move(entity, -1, speed);
	}

	this.move_away = function(entity, speed) {
		return this.move(entity, 1, speed);
	}
	
	this.set_velocity = function() {
		//if (this.velocity == false) {
			dist = distance(this.loc, this.target);
			this.velocity = new Vector(0,0);
			this.velocity.x = (this.loc.x - this.target.x) / dist;
			this.velocity.y = (this.loc.y - this.target.y) / dist;
		//}	
	}

	// entity - the outside target or repulsor, a vector
	// direction - move towards (-1) or away from (1) the entity
	// speed - rate of movement
	this.move = function(entity, direction, speed) {
		dist = distance(this.loc, this.target);
		this.loc.x += direction * speed * this.velocity.x;
		this.loc.y += direction * speed * this.velocity.y;
		return dist;
	}
}

// TODO - finish, represents a range attack for 
function RangeAttack(x, y, radius, locomotion, type, func, player){

}
