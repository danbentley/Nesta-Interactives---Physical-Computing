jasmine.getFixtures().fixturesPath = 'base/test/fixtures';
loadFixtures('index.html');

describe('ParseCommands tests', function() {

    var grid = new Grid();

    it('Parse basic commands (non-repeatable)', function() {
        var commandString = 'left\n right\n up\n down';
        var commands = grid.parseCommandString(commandString);
        expect(commands.length).toEqual(4);
    });

    it('Parse repeatable commands', function() {
        var commandString = 'left\n right\n move(10)';
        var commands = grid.parseCommandString(commandString);
        expect(commands.length).toEqual(12);
        expect(commands.indexOf('move(10)')).toBe(-1);
    });

    it('Parse repeatable commands in middle of list', function() {
        var commandString = 'left\n right\n move(10)\n up\n down';
        var commands = grid.parseCommandString(commandString);
        expect(commands.length).toEqual(14);
        expect(commands.indexOf('move(10)')).toBe(-1);
    });
});

describe('Robots can move to position', function() {

    var grid = new Grid(),
        robot = new Robot(grid),
        directions = ['up', 'down', 'left', 'right'];

    beforeEach(function() {
        // Maze is randomly created. Ensure that the current cell has no barriers
        var cells = grid.getCells();
        cells.removeClass('wall-up wall-down wall-left wall-right');
        directions = ['up', 'down', 'left', 'right'];
    });

    it('basic boundaries directions', function() {
        var canMoveToPosition = robot.canMoveToPosition({ x: 1, y: 1 }, 'up');
        expect(canMoveToPosition).toBeTruthy();

        var canMoveToPosition = robot.canMoveToPosition({ x: 1, y: 1 }, 'down');
        expect(canMoveToPosition).toBeTruthy();

        var canMoveToPosition = robot.canMoveToPosition({ x: 1, y: 1 }, 'left');
        expect(canMoveToPosition).toBeTruthy();

        var canMoveToPosition = robot.canMoveToPosition({ x: 1, y: 1 }, 'right');
        expect(canMoveToPosition).toBeTruthy();
    });

    it('Outer grid boundaries', function() {
        var canMoveToPosition = robot.canMoveToPosition({ x: -1, y: 1 }, 'up');
        expect(canMoveToPosition).toBeFalsy();

        var canMoveToPosition = robot.canMoveToPosition({ x: 1, y: -1 }, 'up');
        expect(canMoveToPosition).toBeFalsy();

        var canMoveToPosition = robot.canMoveToPosition({ x: 17, y: 1 }, 'up');
        expect(canMoveToPosition).toBeFalsy();

        var canMoveToPosition = robot.canMoveToPosition({ x: 1, y: 17 }, 'up');
        expect(canMoveToPosition).toBeFalsy();
    });

    var testCantGoInDirection = function(direction) {
        it('Shouldn\'t be allowed to go ' + direction, function() {
            var cell = robot.getCell();
            $(cell).addClass('wall-' + direction);
            var canMoveToPosition = robot.canMoveToPosition({ x: 2, y: 2 }, direction);
            expect(canMoveToPosition).toBeFalsy();
        });
    };

    var testCanGoInDirection = function(direction) {
        it('Should be allowed to go ' + direction, function() {
            var cell = robot.getCell();
            $(cell).addClass('wall-' + direction);

            var directionIndex = directions.indexOf(direction);
            if (directionIndex > -1) {
                directions.splice(directionIndex, 1);
            }

            for (var i=0; i < directions.length; i++) {
                var directionToTest = directions[i];
                var canMoveToPosition = robot.canMoveToPosition({ x: 2, y: 2 }, directionToTest);
                expect(canMoveToPosition).toBeTruthy();
            };
        });
    };

    for (var i=0; i < directions.length; i++) {
        var direction = directions[i];
        testCantGoInDirection(direction);
        testCanGoInDirection(direction);
    };
});
