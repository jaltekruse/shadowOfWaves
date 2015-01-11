
function updateViewEdgeMouseScroll() {

	// Update view 
	var speed = 20;
	var movement_boarder = .15;
	var left_movement_border = movement_boarder * screen_size.x;
	var mp = p.mouse_pos;
	var origin = p.origin;
	if (mp.x < left_movement_border && origin.x > 0) {
		origin.x -= speed * (left_movement_border - mp.x)/left_movement_border;
	}
	var right_movement_border = screen_size.x - movement_boarder * screen_size.x;
	if (mp.x > right_movement_border && origin.x + screen_size.x < map_size.x) {
		origin.x += speed * (mp.x - right_movement_border)/(screen_size.x - right_movement_border);
	}
	var top_movement_border = movement_boarder * screen_size.y;
	if (mp.y < top_movement_border && origin.y > 0) {
		origin.y -= speed * (top_movement_border - mp.y)/top_movement_border;
	}
	var bottom_movement_border = screen_size.y - movement_boarder * screen_size.y;
	if (mp.y > bottom_movement_border && origin.y + screen_size.y < map_size.y ) {
		origin.y += speed * (mp.y - bottom_movement_border)/(screen_size.y - bottom_movement_border);
	}

	// snap to edge map
	if (origin.y < 0) origin.y = 0;
	if (origin.y > map_size.y) origin.y = map_size.y - screen_size.y;
	if (origin.x < 0) origin.x = 0;
	if (origin.x > map_size.x) origin.x = map_size.x - screen_size.x;
}
function mouse_up(evt){
	p.selection.x = -1;
	p.selection.y = -1;
	p.selection.w = 1;
	p.selection.h = 1;
	p.selection_status.x = -10;
	p.selection_status.y = -10;
}

function mouse_down(evt){
    x = evt.offsetX?(evt.offsetX):evt.pageX-document.getElementById("game_canvas").offsetLeft;
    y = evt.offsetY?(evt.offsetY):evt.pageY-document.getElementById("game_canvas").offsetTop;
    // left mouse button
    if (evt.button == 0) {
        p.selection.x = x + p.origin.x;
        p.selection.y = y + p.origin.y;
    } else if (evt.button == 2) { // right mouse button
        // update selected units
        unit_selected = false;
        movement_group = false;
        for (var j = 0; j < p.units.length; j++){
            unit = p.units[j];
            if (unit.selected) {
                if ( ! unit_selected) {
                    movement_group = new Array();
                    p.movement_groups.push(movement_group);
                    unit_selected = true;
                }
                movement_group.push(unit);
                unit.movement_group = movement_group;
                unit.move_to(new Vector(x + p.origin.x, y + p.origin.y));
            }
        }
        // temprorary debugging for 'center of mass' calculation
        for (var j = 0; j < p.units.length; j++){
            unit = p.units[j];
            if (unit.selected) {
                unit.update();
            }
        }
        console.log(movement_group);
    }
}
function mouse_scroll(evt){

}

function mouse_move(evt){
	x = evt.offsetX?(evt.offsetX):evt.pageX-document.getElementById("game_canvas").offsetLeft;
	y = evt.offsetY?(evt.offsetY):evt.pageY-document.getElementById("game_canvas").offsetTop;
	p.mouse_pos.x = x;
	p.mouse_pos.y = y;

	// adjust the selection rectangle
	var s =	p.selection;
	if ( Math.abs(p.selection_status.x) != 1)
	{// first time the mouse is moving after the mouse was pressed
		if ( x + p.origin.x < s.x )
			p.selection_status.x = -1;
		else
			p.selection_status.x = 1;
		if ( y + p.origin.y < s.y )
			p.selection_status.y = -1;
		else
			p.selection_status.y = 1;
	}
	if ( s.x > 0 && s.y > 0){
		if (p.selection_status.x == 1){
			s.w = x + p.origin.x - s.x;
		}
		else{
			s.w += s.x - (x + p.origin.x);
			s.x = x + p.origin.x;
		}
		if (p.selection_status.y == 1){
			s.h = y + p.origin.y - s.y;
		}
		else{
			s.h += s.y - (y + p.origin.y);
			s.y = y + p.origin.y;
		}
		
	}
	if ( s.w < 0 ){
		s.x = s.x + s.w;
		s.w = Math.abs(s.w);
		p.selection_status.x *= -1;
	}
	if ( s.h < 0 ){
		s.y = s.y + s.h;
		s.h = Math.abs(s.h);
		p.selection_status.y *= -1;
	}

	// update selected units
	if ( s.x > 0 && s.y > 0){
		for (var j = 0; j < p.units.length; j++){
			p.units[j].selected = false;
			if ( intersectRect(p.units[j].collision_rect(), p.selection) ){
				p.units[j].selected = true;
			}
		}
	}
}
