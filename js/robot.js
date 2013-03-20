function Robot(grid) {
	this.position = { x:1, y:1 };
	this.$grid = grid.$grid;
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
	this.$grid.find('span').removeClass('active direction-up direction-down direction-left direction-right');
	var cell = this.getCell();
	cell.addClass('active');
	cell.addClass('direction-' + this.direction);
};

Robot.prototype.move = function() {
	var newPosition = this.getPositionForDirection(this.direction);
	if (this.canMoveToPosition(newPosition, this.direction)) {
		this.position = newPosition;
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
	return this.getCellForPosition(this.position);
};

Robot.prototype.getCellForPosition = function(position) {
	return this.$grid.find('#grid-' + position.x + '-' + position.y);
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

	if (position.x < 0 || position.y < 0) return false;
	if (position.x > 16 || position.y > 16) return false;

	var cell = this.getCell();
	if (cell.hasClass('wall-' + direction)) {
		return false;
	}

	var newCell = this.getCellForPosition(position);
	if (newCell.hasClass('wall-' + this.getOppositeDirection(direction))) {
		return false;
	}

	return true;
}

Robot.prototype.getOppositeDirection = function(direction) {
	var index = this.directions.indexOf(direction);
	if (index > 0) {
		var oppositeDirectionIndex = (index % 2) ? index - 1 : index + 1;
		return this.directions[oppositeDirectionIndex];
	}
}

