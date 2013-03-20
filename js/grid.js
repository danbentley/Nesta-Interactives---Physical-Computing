
function Grid(options) {
	this.gridCount = 1;
	this.validCommands = ['up', 'down', 'left', 'right', 'move'];
	this.$gridEl;
	this.$commands = $('#commands');
	this.robot;
	this.dimensions = {
		x: 16,
		y: 16,
	};
	this.start();
}

Grid.prototype.start = function() {
	this.addListeners();
	this.draw();
	this.$gridEl = $('div#grid');
	this.robot = new Robot(this.$gridEl);
	this.refresh();
};

Grid.prototype.addListeners = function() {

	$('a.up').on('click', function(e) {
		$commands.val($commands.val() + 'up\n');
		e.preventDefault();
	});

	$('a.down').on('click', function(e) {
		$commands.val($commands.val() + 'down\n');
		e.preventDefault();
	});

	$('a.left').on('click', function(e) {
		$commands.val($commands.val() + 'left\n');
		e.preventDefault();
	});

	$('a.right').on('click', function(e) {
		$commands.val($commands.val() + 'right\n');
		e.preventDefault();
	});

	$('form#code').on('submit', $.proxy(function(e) {

		var commands = this.parseCommandString(this.$commands.val())
		this.executeCommands(commands);

		e.preventDefault();
	}, this));
};

Grid.prototype.parseCommandString = function(commandString) {
	var commands = commandString.split('\n');

	var newCommands = $.extend({}, commands);
	$.each(newCommands, function(index, command) {
		var matches = command.match(/(\w+)\((\d+)\)/);
		if (matches && matches.length > 2) {

			var matchedCommand = matches[1];
			var count = matches[2];

			var repeatingCommands = [];
			for (var i=0; i < count; i++) {
				var toReplace = (i === 0) ? 1 : 0;
				commands.splice(index, toReplace, matchedCommand);
			};
		}
	});

	return commands;
}

Grid.prototype.executeCommands = function(commands) {

	var intervalId;

	clearInterval(intervalId);
	intervalId = setInterval($.proxy(function() {
		var command = commands.shift();
		if (commands.length === 0) {
			clearInterval(intervalId);
			return;
		}
		if (this.validCommands.indexOf(command) > -1) {
			this.robot[command]();
		}
	}, this), 500);
};

Grid.prototype.draw = function() {
	this.drawGrid();
	this.drawMaze();
};

Grid.prototype.refresh = function() {
	$(window).trigger('grid.refresh');
};

Grid.prototype.drawGrid = function(i) {
	var markup = '<div id="grid">';
	for (var x = 0; x < this.dimensions.x; x++) {
		for (var y = 0; y < this.dimensions.y; y++) {
			markup += '<span id="grid-' + x + '-' + y + '" />';
		};
	};
	markup += '</div>';
	$('div.grids').append(markup);
};

Grid.prototype.drawMaze = function() {

	var wallClasses = ['wall-up', 'wall-down', 'wall-left', 'wall-right'];

	$('span[id^=grid-]').each(function() {
		wallClass = wallClasses[Math.floor((Math.random() * 4) + 1)];
		$(this).addClass(wallClass);
	});
};
