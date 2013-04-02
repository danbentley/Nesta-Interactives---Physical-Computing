define(['jquery'], function() {

	var defaults = {
		dimensions: {
			x: 8,
			y: 12
		}
	};

	function Grid(options) {
		var opts = $.extend(defaults, options);
		this.gridCount = 1;
		this.validCommands = ['up', 'down', 'left', 'right', 'move'];
		this.$commands = $('#commands');
		this.robot;
		this.$grid = $('div#grid');
		this.dimensions = opts.dimensions;
	}

	Grid.prototype.init = function() {
		this.addListeners();
		this.draw();
		this.refresh();
	};

	Grid.prototype.addListeners = function() {

		$('a.up').on('click', $.proxy(function(e) {
			this.$commands.val(this.$commands.val() + 'up\n');
			e.preventDefault();
		}, this));

		$('a.down').on('click', $.proxy(function(e) {
			this.$commands.val(this.$commands.val() + 'down\n');
			e.preventDefault();
		}, this));

		$('a.left').on('click', $.proxy(function(e) {
			this.$commands.val(this.$commands.val() + 'left\n');
			e.preventDefault();
		}, this));

		$('a.right').on('click', $.proxy(function(e) {
			this.$commands.val(this.$commands.val() + 'right\n');
			e.preventDefault();
		}, this));

		$('a.move').on('click', $.proxy(function(e) {
			this.$commands.val(this.$commands.val() + 'move(1)\n');
			e.preventDefault();
		}, this));

		$('form#code').on('submit', $.proxy(function(e) {

			var commands = this.parseCommandString(this.$commands.val())
			this.executeCommands(commands);

			e.preventDefault();
		}, this));
	};

	Grid.prototype.parseCommandString = function(commandString) {

		var parsedCommands = [];

		var offset = 0;
		var commands = commandString.split(new RegExp("\\s*\\\n\\s*"));
		$.each(commands, function(index, command) {
			var matches = command.match(/(\w+)\((\d+)\)/);
			if (matches && matches.length > 2) {

				var matchedCommand = matches[1];
				var count = matches[2];

				for (var i=0; i < count; i++) {
					parsedCommands.push(matchedCommand);
				};
			} else {
				parsedCommands.push(command);
			}
		});

		return parsedCommands;
	}

	Grid.prototype.getCells = function() {
		return this.$grid.find('[id^=grid-]');
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

		$('span[id^=grid-]').each(function() {
			wallClass = wallClasses[Math.floor((Math.random() * 4) + 1)];
			$(this).addClass(wallClass);
		});

		this.distributeItems();
		this.drawGoal();
	};

	Grid.prototype.distributeItems = function() {
		var $cells = $('span[id^=grid-]');
		$cells.append('<span class="item" />');
	};

	Grid.prototype.drawGoal = function() {
		var $cell = $('span#grid-7-11').append('<span class="wall" />');
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
