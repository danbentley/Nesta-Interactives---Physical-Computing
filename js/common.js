$(document).ready(function() {

	var gridCount = 1;

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

			var commands = $commands.val().split('\n');
			executeCommands(commands);

			e.preventDefault();
		});
	}

	function executeCommands(commands) {

		var validCommands = ['up', 'down', 'left', 'right'];
		var intervalId;
		var index = 0;

		clearInterval(intervalId);
		intervalId = setInterval(function() {
			if (!(index in commands)) return;
			command = commands[index];
			if (validCommands.indexOf(command) > -1) {
				robot[command]();
			}
			index++;
		}, 1000);
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
