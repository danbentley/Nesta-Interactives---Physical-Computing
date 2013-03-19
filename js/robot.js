var robot;

function Robot(grid) {
	this.position = { x:1, y:1 };
	this.$grid = grid;
	this.addListeners();
}

Robot.prototype.addListeners = function() {
	$(window).on('grid.refresh', $.proxy(function() {
		this.draw();
	}, this));
};

Robot.prototype.draw = function() {
	this.$grid.find('span').removeClass('active');
	var cell = this.getCell();
	cell.addClass('active');
};

Robot.prototype.up = function() {
	var currentPosition = this.position;
	newPosition = { x:currentPosition.x--, y:currentPosition.y };
	if (this.canMoveToPosition(newPosition, 'up')) {
		this.position = newPosition;
		this.draw();
	}
};

Robot.prototype.down = function() {
	var currentPosition = this.position;
	newPosition = { x:currentPosition.x++, y:currentPosition.y};
	if (this.canMoveToPosition(newPosition, 'down')) {
		this.position = newPosition;
		this.draw();
	}
};

Robot.prototype.left = function() {
	var currentPosition = this.position;
	newPosition = { x:currentPosition.x, y:currentPosition.y--};
	if (this.canMoveToPosition(newPosition, 'left')) {
		this.position = newPosition;
		this.draw();
	}
};

Robot.prototype.right = function() {
	var currentPosition = this.position;
	newPosition = { x:currentPosition.x, y:currentPosition.y++ };
	if (this.canMoveToPosition(newPosition, 'right')) {
		this.position = newPosition;
		this.draw();
	}
};

Robot.prototype.getCell = function() {
	return this.getCellForPosition(this.position);
}

Robot.prototype.getCellForPosition = function(position) {
	return this.$grid.find('#grid-' + position.x + '-' + position.y);
}

Robot.prototype.canMoveToPosition = function(position, direction) {

	var cell = this.getCell();
	if (cell.hasClass('wall-right')) {
		return false;
	}

	var newCell = this.getCellForPosition(position);
	if (newCell.hasClass('wall-right')) {
		return false;
	}

	return true;
}

