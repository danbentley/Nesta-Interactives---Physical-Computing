define(['src/grid', 'src/robot'], function(Grid, Robot) {

	function App() {

	}

	App.prototype.start = function() {
		var grid = new Grid({
			x:10,
			y:5,
		});
		var robot = new Robot(grid);
		grid.init();
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
