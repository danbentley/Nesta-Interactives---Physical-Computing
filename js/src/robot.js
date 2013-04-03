define(['jquery', 'lib/jquery.transit.min'], function() {

	function Robot(grid) {
		this.position = { x:0, y:0 };
		this.grid = grid;
		this.grid.robot = this;
		this.$grid = this.grid.$grid;
		this.addListeners();
		this.directions = ['up', 'left', 'down', 'right'];
		this.direction = 'up';
	}

	Robot.prototype.addListeners = function() {
		$(window).on('grid.refresh', $.proxy(function() {
			this.init();
		}, this));
	};

	Robot.prototype.init = function() {
		var cell = this.getCell();
		this.$grid.find('.robot').remove();
		cell.append('<span id="robot" class="robot direction-' + this.direction + '"><span class="eye left-eye"></span><span class="eye right-eye"></span><span class="mouth"></span></span>');
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

			var transition = this.getTransitionForDirection(this.direction);
			$('.robot').transition(transition, $.proxy(function() {
				this.init();
			}, this));
		}
	}

	Robot.prototype.up = function() {
		var newPosition = $.extend({}, this.position);
		var direction = 'up';
		this.turnToDirection(direction);
		this.direction = direction;
	};

	Robot.prototype.down = function() {
		var newPosition = $.extend({}, this.position);
		this.direction = 'down';
		//this.draw();
		$('.robot').transition({ rotate:'180deg' });
	};

	Robot.prototype.left = function() {
		var newPosition = $.extend({}, this.position);
		this.direction = 'left';
		//this.draw();
		$('.robot').transition({ rotate:'270deg' });
	};

	Robot.prototype.right = function() {
		var newPosition = $.extend({}, this.position);
		this.direction = 'right';
		//this.draw();
		$('.robot').transition({ rotate:'90deg' });
	};

	Robot.prototype.getCell = function() {
		return this.grid.getCellForPosition(this.position);
	};

	Robot.prototype.turnToDirection = function(direction) {
		var currentDirection = this.direction;
		var degrees = this.getDegreesToFromDirection(direction, currentDirection);
		$('.robot').transition({ rotate:degrees + 'deg' });
	};

	Robot.prototype.getDegreesToFromDirection = function(toDirection, fromDirection) {
		var toIndex = this.directions.indexOf(toDirection);
		var fromIndex = this.directions.indexOf(fromDirection);
		return 0;
	}

	Robot.prototype.getTransitionForDirection = function(direction) {
		if (this.direction === 'up') {
			return { x:0, y:'+=65' };
		} else if (this.direction === 'down') {
			return { x:0, y:'-=65' };
		} else if (this.direction === 'left') {
			return { x:0, y:'+=65' };
		} else if (this.direction === 'right') {
			return { x:0, y:'-=65' };
		}
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
			var oppositeDirectionIndex = (index > 1) ? index - 2 : index + 2;
			return this.directions[oppositeDirectionIndex];
		}
	};

	Robot.prototype.collectItem = function() {
		var $cell = this.getCell();
		$cell.find('span.item').remove();
	};

	return Robot;
});
