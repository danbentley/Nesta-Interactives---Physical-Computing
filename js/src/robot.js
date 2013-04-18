define(['jquery', 'lib/jquery.transit.min'], function() {

	function Robot(grid) {
		this.position = { x:0, y:0 };
		this.grid = grid;
		this.grid.robot = this;
		this.$grid = this.grid.$grid;
		this.addListeners();
		this.directions = ['up', 'right', 'down', 'left'];
		this.direction = 'up';
		this.itemCount = 0;
		this.validCommands = ['up', 'down', 'left', 'right', 'move'];
		this.executeCommandsInterval = null;
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
		console.log('this.direction: ' + this.direction);
		var $cell = this.getCell();
		if (this.doesCellContainGoalInDirection($cell, this.direction)) {
			$(window).trigger('robot.wins');
		}
		if (this.canMoveToPosition(newPosition, this.direction)) {
			this.position = newPosition;

			var transition = this.getTransitionForDirection(this.direction);
			$('.robot').transition(transition, $.proxy(function() {
				this.init();
			}, this));
		} 
	};

	Robot.prototype.up = function() {
		if (!this.shouldTurnToDirection('up')) return;
		var direction = 'up';
		this.turnToDirection(direction);
	};

	Robot.prototype.down = function() {
		if (!this.shouldTurnToDirection('down')) return;
		var direction = 'down';
		this.turnToDirection(direction);
	};

	Robot.prototype.left = function() {
		if (!this.shouldTurnToDirection('left')) return;
		var direction = 'left';
		this.turnToDirection(direction);
	};

	Robot.prototype.right = function() {
		if (!this.shouldTurnToDirection('right')) return;
		var direction = 'right';
		this.turnToDirection(direction);
	};

	Robot.prototype.dance = function() {
		this.executeCommands([
			'up',
			'down',
			'left',
			'right',
			'left',
			'right',
			'up',
			'left',
			'up',
			'left',
			'down'
		]);
	};

	Robot.prototype.getCell = function() {
		return this.grid.getCellForPosition(this.position);
	};

	Robot.prototype.shouldTurnToDirection = function(direction) {
		return (direction !== this.direction);
	};

	Robot.prototype.turnToDirection = function(direction) {
		var currentDirection = this.direction;
		var degrees = this.getDegreesToFromDirection(direction, currentDirection);
		$('.robot').transition({ rotate:degrees + 'deg' }, $.proxy(function() {
			this.direction = direction;
			this.init();
		}, this));
	};

	Robot.prototype.getDegreesToFromDirection = function(toDirection, fromDirection) {
		var toIndex = this.directions.indexOf(toDirection);
		var fromIndex = this.directions.indexOf(fromDirection);

		if (fromDirection === 'left') {
			return ((fromIndex + toIndex) - 2) * 90;
		}

		if (fromDirection === 'right') {
			var turns = toIndex - fromIndex;
			turns = (turns < 0) ? 3 : turns;
			return turns * 90;
		}

		if (toIndex > fromIndex) {
			return (toIndex - fromIndex)  * 90;
		} else {
			return (fromIndex + toIndex)  * 90;
		}
	}

	Robot.prototype.getTransitionForDirection = function(direction) {
		if (this.direction === 'up') {
			return { x:0, y:'-=65' };
		} else if (this.direction === 'down') {
			return { x:0, y:'+=65' };
		} else if (this.direction === 'left') {
			return { x:'-=65', y:0 };
		} else if (this.direction === 'right') {
			return { x:'+=65', y:0 };
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

		console.log(this.grid.dimensions);
		console.log(position);
		console.log(direction);
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
		this.itemCount++;
		var $cell = this.getCell();
		$cell.find('span.item').remove();
	};

	Robot.prototype.executeCommands = function(commands) {

		clearInterval(this.executeCommandsInterval);
		this.executeCommandsInterval = setInterval($.proxy(function() {
			if (commands.length === 0) {
				clearInterval(this.executeCommandsInterval);
				$(window).trigger('commands.complete');
				return;
			}
			var command = commands.shift();
			if (this.validCommands.indexOf(command) > -1) {
				this[command]();
			}
		}, this), 500);
	};

	return Robot;
});
