define(['jquery'], function() {

	var defaults = {
		dimensions: {
			x: 8,
			y: 12
		},
		goalPosition: {
			x: 4,
			y: 7
		}
	};

	function Grid(dimensions) {
		this.gridCount = 1;
		this.robot;
		this.$grid = $('div#grid');
		this.dimensions = $.extend(defaults.dimensions, dimensions);
		this.goalPosition = $.extend(defaults.goalPosition, dimensions);
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
				markup += '<span id="grid-' + x + '-' + y + '"><span class="wall" /></span>';
			};
		};
		this.$grid.append(markup);

	};

	Grid.prototype.drawMaze = function() {

		var wallClasses = ['wall-up', 'wall-down', 'wall-left', 'wall-right'];

		$('#grid-0-1, #grid-0-2, #grid-0-4, #grid-0-5, #grid-0-8, #grid-1-3, #grid-1-4, #grid-1-9, #grid-3-1, #grid-3-2, #grid-3-3').addClass('wall-down');
		$('#grid-0-9, #grid-1-1, #grid-1-7, #grid-2-1, #grid-2-2, #grid-2-5, #grid-2-6, #grid-2-7, #grid-2-9, #grid-3-4, #grid-3-5, #grid-3-7, #grid-4-5, #grid-4-6').addClass('wall-left');
		$('#grid-3-8, #grid-4-7').addClass('wall-up');
		$('#grid-0-3, #grid-4-8').addClass('wall-right');

		/*
		$('span[id^=grid-]').each(function() {
			wallClass = wallClasses[Math.floor((Math.random() * 4) + 1)];
			$(this).addClass(wallClass);
		});
		*/

		this.distributeItems();
		this.drawGoal();
	};

	Grid.prototype.distributeItems = function() {
		var $cells = $('span[id^=grid-]');
		$cells.append('<span class="item" />');
	};

	Grid.prototype.drawGoal = function() {
		var $cell = this.getCellForPosition(this.goalPosition)
		$cell.addClass('wall-right');
		$cell.find('.wall').addClass('goal');
	};

	Grid.prototype.getCellForPosition = function(position) {
		return this.$grid.find('#grid-' + position.x + '-' + position.y);
	};

	Grid.prototype.isPositionWithinBounds = function(position) {
		if (position.x < 0 || position.y < 0) return false;
		if (position.x > this.dimensions.x || position.y > this.dimensions.y) return false;

		return true;
	};

	return Grid;
});
