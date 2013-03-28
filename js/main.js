require(['src/grid', 'src/robot'], function(Grid, Robot) {
	var grid = new Grid();
	var robot = new Robot(grid);
	grid.start();
});
