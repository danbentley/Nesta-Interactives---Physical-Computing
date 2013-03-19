function parseCommandString(commandString) {
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

$(document).ready(function() {

	var gridCount = 1;
	var validCommands = ['up', 'down', 'left', 'right', 'move'];

	var grid = {
		dimensions: {
			x: 16,
			y: 16,
		}
	};

	var gridEl;
	var $commands = $('#commands');

	function start() {
		addListeners();
		draw();
		gridEl = $('div#grid');
		robot = new Robot(gridEl);
		refresh();
	}

	function addListeners() {

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

		$('form#code').on('submit', function(e) {

			var commands = parseCommandString($commands.val())
			executeCommands(commands);

			e.preventDefault();
		});
	}


	function executeCommands(commands) {

		var intervalId;

		clearInterval(intervalId);
		intervalId = setInterval(function() {
			var command = commands.shift();
			if (commands.length === 0) {
				clearInterval(intervalId);
				return;
			}
			if (validCommands.indexOf(command) > -1) {
				robot[command]();
			}
		}, 500);
	}

	function draw() {
		drawGrid();
		drawMaze();
	}

	function refresh() {
		$(window).trigger('grid.refresh');
	}

	function drawGrid(i) {
		var markup = '<div id="grid">';
		for (var x = 0; x < grid.dimensions.x; x++) {
			for (var y = 0; y < grid.dimensions.y; y++) {
				markup += '<span id="grid-' + x + '-' + y + '" />';
			};
		};
		markup += '</div>';
		$('div.grids').append(markup);
	}

	function drawMaze() {

		var wallClasses = ['wall-up', 'wall-down', 'wall-left', 'wall-right'];

		$('span[id^=grid-]').each(function() {
			wallClass = wallClasses[Math.floor((Math.random() * 4) + 1)];
			$(this).addClass(wallClass);
		});
	}

	start();
});
