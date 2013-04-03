define(['jquery'], function() {

	function Robot(grid) {
		this.position = { x:0, y:0 };
		this.grid = grid;
		this.grid.robot = this;
		this.$grid = this.grid.$grid;
		this.addListeners();
		this.directions = ['up', 'down', 'left', 'right'];
		this.direction = 'up';
	}

	Robot.prototype.addListeners = function() {
		$(window).on('grid.refresh', $.proxy(function() {
			this.draw();
		}, this));
	};

	Robot.prototype.draw = function() {
		this.$grid.find('.robot').remove();
		var cell = this.getCell();
		cell.append('<span class="robot direction-' + this.direction + '"><span class="eye left-eye"></span><span class="eye right-eye"></span><span class="mouth"></span></span>');
		cell.addClass('active');
		this.collectItem();
	};

	Robot.prototype.move = function() {
		var newPosition = this.getPositionForDirection(this.direction);
		var $cell = this.getCell();
		if (this.doesCellContainGoalInDirection($cell, this.direction)) {
			$(window).trigger('robot.wins');
		}
		if (this.canMoveToPosition(newPosition, this.direction)) {
			this.position = newPosition;
			this.collectItem();
			this.draw();
		}
	}

	Robot.prototype.up = function() {
		var newPosition = $.extend({}, this.position);
		this.direction = 'up';
		this.draw();
	};

	Robot.prototype.down = function() {
		var newPosition = $.extend({}, this.position);
		this.direction = 'down';
		this.draw();
	};

	Robot.prototype.left = function() {
		var newPosition = $.extend({}, this.position);
		this.direction = 'left';
		this.draw();
	};

	Robot.prototype.right = function() {
		var newPosition = $.extend({}, this.position);
		this.direction = 'right';
		this.draw();
	};

	Robot.prototype.getCell = function() {
		return this.grid.getCellForPosition(this.position);
	};

	Robot.prototype.getPositionForDirection = function(direction) {

		var newPosition = $.extend({}, this.position);

		if (direction === 'up') {
			newPosition.x--;
		}

		if (direction === 'down') {
			newPosition.x++;
		}

		if (direction === 'left') {
			newPosition.y--;
		}

		if (direction === 'right') {
			newPosition.y++;
		}

		return newPosition;
	};

	Robot.prototype.canMoveToPosition = function(position, direction) {

		if (!this.grid.isPositionWithinBounds(position)) return false;

		var cell = this.getCell();
		if (!this.checkCellInDirection(cell, direction)) {
			return false;
		}

		var newCell = this.grid.getCellForPosition(position);
		var oppositeDirection = this.getOppositeDirection(direction);
		if (!this.checkCellInDirection(newCell, oppositeDirection)) {
			return false;
		}

		return true;
	}

	Robot.prototype.checkCellInDirection = function(cell, direction) {
		return (this.doesCellContainGoalInDirection(cell, direction) 
				|| !this.doesCellContainWallInDirection(cell, direction));
	};

	Robot.prototype.doesCellContainWallInDirection = function(cell, direction) {
		return (cell.hasClass('wall-' + direction));
	};

	Robot.prototype.doesCellContainGoalInDirection = function(cell, direction) {
		return cell.find('span.wall').hasClass('goal');
	};

	Robot.prototype.getOppositeDirection = function(direction) {
		var index = this.directions.indexOf(direction);

		if (index > -1) {
			var oppositeDirectionIndex = (index % 2) ? index - 1 : index + 1;
			return this.directions[oppositeDirectionIndex];
		}
	};

	Robot.prototype.collectItem = function() {
		var $cell = this.getCell();
		$cell.find('span.item').remove();
	};

	return Robot;
});
