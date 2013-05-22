define(['jquery'], function($) {

	var defaults = {
		dimensions: {
			x: 8,
			y: 12
		}
	};

	function Grid(dimensions) {
		this.gridCount = 1;
		this.robot;
		this.maze;
		this.$grid = $('div#grid');
		this.dimensions = $.extend(defaults.dimensions, dimensions);
	}

	Grid.prototype.init = function() {
		this.draw();
		this.refresh();
	};

	Grid.prototype.getCells = function() {
		return this.$grid.find('[id^=grid-]');
	}

	Grid.prototype.draw = function() {
		this.drawGrid();
		this.drawMaze();
	};

	Grid.prototype.refresh = function() {
		$(window).trigger('grid.refresh');
	};

	Grid.prototype.drawGrid = function(i) {
		var markup = '';
		for (var x = 0; x < this.dimensions.x; x++) {
			for (var y = 0; y < this.dimensions.y; y++) {
				markup += '<span id="grid-' + x + '-' + y + '" class="row-' + x + '"></span>';
			};
		};
		this.$grid.append(markup);

	};

	Grid.prototype.loadMaze = function(maze) {
		this.maze = maze;
		this.goalPosition = maze.goal;
	};

	Grid.prototype.drawMaze = function() {

		var directions = ['up', 'down', 'left', 'right'];

		$.each(directions, $.proxy(function(index, direction) {
			var walls = this.maze[direction];
			var selectors = [];
			$.each(walls, function(i, wall) {
				selectors.push('#grid-' + wall.x + '-' + wall.y);
			});
			var selector = selectors.join(', ');
			this.addWallForDirection($(selector), direction);
		}, this));

		this.distributeItems();
		this.drawGoal();
	};

	Grid.prototype.addWallForDirection = function($cell, direction) {
		$cell.addClass('wall-' + direction).append('<span class="wall wall-' + direction + '" />');
	};

	Grid.prototype.distributeItems = function() {
		var $cells = $('span[id^=grid-]');
		$cells.append('<span class="item" />');
	};

	Grid.prototype.drawGoal = function() {
		var $cell = this.getCellForPosition(this.goalPosition)
		this.addWallForDirection($cell, 'right');
		$cell.find('.wall-right').addClass('goal');
	};

	Grid.prototype.getCellForPosition = function(position) {
		return this.$grid.find('#grid-' + position.x + '-' + position.y);
	};

	Grid.prototype.isPositionWithinBounds = function(position) {
		if (position.x < 0 || position.y < 0) return false;
		if (position.x >= this.dimensions.x || position.y >= this.dimensions.y) return false;

		return true;
	};

	return Grid;
});
