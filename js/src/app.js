define(['src/grid', 'src/robot'], function(Grid, Robot) {

	function App() {

	}

	App.prototype.start = function() {
		var grid = new Grid();
		var robot = new Robot(grid);
		grid.start();
		this.addListeners();
	};

	App.prototype.addListeners = function() {
		$(window).on('robot.wins', $.proxy(function() {
			this.end();
		}, this));
	};

	App.prototype.end = function() {
		alert('Robot wins!');
	};

	return App;
});
