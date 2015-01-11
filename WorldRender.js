
function drawWorld(){
	var canvas = document.getElementById("game_canvas");
	if (canvas.getContext) {
		ctx = canvas.getContext("2d");	

		ctx.fillStyle = "rgb(230, 230, 255)";
		ctx.fillRect(0,0, screen_size.x, screen_size.y);

		for (var i = 0; i < thisGame.players.length; i++){
			for (var j = 0; j < thisGame.players[i].units.length; j++){
				thisGame.players[i].units[j].draw(ctx, thisGame, p);
			}
		}
		draw_selection(ctx);
    }

    // draw the minimap
    draw_minimap(ctx, thisGame, p);
    draw_menu(ctx, thisGame, p);
	//ctx.fillText("sel: " + p.selection.x + ", " + p.selection.y + ", " + p.selection.w + ", " + p.selection.h, 30, 500);
}

function draw_minimap(ctx, thisGame, player) {
    // minimap should take up apprx 1/3 vertical and 1/4 horizontal size of screen
    var minimap_dimensions = new Vector(0.25, 0.3);
	ctx.strokeStyle = "rgb(20, 20, 20)";
    ctx.strokeRect(0, screen_size.y - screen_size.y * minimap_dimensions.y, 
            screen_size.x * minimap_dimensions.x, 
            screen_size.y * minimap_dimensions.y)
	ctx.fillStyle = "rgb(230, 230, 255)";
    // the size of the rectangle on the menu
    minimap = new Rect(0, screen_size.y - screen_size.y * minimap_dimensions.y,
                       screen_size.x * minimap_dimensions.x, 
                       screen_size.y * minimap_dimensions.y);

    // calculate the size of the minimap, depending on the limiting factors of
    // the ratio of width/height of the overall map and the minimap menu element

            
    ctx.fillRect(minimap.x, minimap.y, minimap.w, minimap.h);
	for (var i = 0; i < thisGame.players.length; i++){
	    ctx.fillStyle = thisGame.players[i].color;
        for (var j = 0; j < thisGame.players[i].units.length; j++){
            obj = thisGame.players[i].units[j];
	        ctx.fillRect( minimap.x + minimap_dimensions.x * (obj.loc.x ),
                          minimap.y + minimap_dimensions.y * (obj.loc.y ), 2, 2 );
        }
    }
}

function draw_menu(ctx, thisGame, palyer) {
    // menu should take up apprx 1/3 vertical and 1/4 horizontal size of screen
    var minimap_dimensions = new Vector(0.25, 0.3);
	ctx.strokeStyle = "rgb(20, 20, 20)";
    ctx.strokeRect(screen_size.x - screen_size.x * minimap_dimensions.x, 
            screen_size.y - screen_size.y * minimap_dimensions.y, 
            screen_size.x * minimap_dimensions.x, 
            screen_size.y * minimap_dimensions.y)
	ctx.fillStyle = "rgb(230, 230, 255)";
    ctx.fillRect(screen_size.x - screen_size.x * minimap_dimensions.x, 
            screen_size.y - screen_size.y * minimap_dimensions.y, 
            screen_size.x * minimap_dimensions.x, 
            screen_size.y * minimap_dimensions.y)

}

function draw_selection(ctx){
	var s =	p.selection;
	if ( s.x < 0 || s.y < 0){
		return
	}
	ctx.strokeStyle = "rgb(0, 0, 0)";
	ctx.strokeRect( s.x - p.origin.x , s.y - p.origin.y, s.w, s.h);
}
