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
			this.robot.executeCommands(commands);

			e.preventDefault();
		}, this));
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
		$('.message').append('<p>You collected ' + this.robot.itemCount + ' items</p>');
		$('#grid').addClass('complete');
		this.robot.dance();
	};

	return App;
});
