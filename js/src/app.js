define(['src/grid', 'src/robot', 'src/maze'], function(Grid, Robot) {

	function App() {
		this.robot;
		this.grid;
		this.$commands = $('#commands');
	}

	App.prototype.init = function() {
		this.grid = new Grid({
			x:5,
			y:10
		});

		var maze = require('src/maze');
		this.grid.loadMaze(maze);

		this.robot = new Robot(this.grid);
		this.grid.init();

		this.addListeners();
	};

	App.prototype.addListeners = function() {

		$(window).on('robot.wins', $.proxy(function() {
			this.end();
		}, this));

		$('a.up').on('click', $.proxy(function(e) {
			this.addCommand('up');
			e.preventDefault();
		}, this));

		$('a.down').on('click', $.proxy(function(e) {
			this.addCommand('down');
			e.preventDefault();
		}, this));

		$('a.left').on('click', $.proxy(function(e) {
			this.addCommand('left');
			e.preventDefault();
		}, this));

		$('a.right').on('click', $.proxy(function(e) {
			this.addCommand('right');
			e.preventDefault();
		}, this));

		$('a.move').on('click', $.proxy(function(e) {
			this.addCommand('move(1)');
			e.preventDefault();
		}, this));

		$('form#code').on('submit', $.proxy(function(e) {

			var commands = this.parseCommandString(this.$commands.val())
			this.robot.executeCommands(commands);

			e.preventDefault();
		}, this));

		$(window).on('commands.complete', $.proxy(function() {
			this.$commands.val('');
		}, this));
	};

	App.prototype.addCommand = function(command) {
		this.$commands.val(this.$commands.val() + command + '\n');
		this.$commands.scrollTop(this.$commands.scrollTop() + 30);
	};

	App.prototype.parseCommandString = function(commandString) {

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
	};

	App.prototype.end = function() {
		$('.message').append('<p>You collected <strong>' + this.robot.itemCount + '</strong> items</p>');
		$('#grid').addClass('complete');
	};

	return App;
});
