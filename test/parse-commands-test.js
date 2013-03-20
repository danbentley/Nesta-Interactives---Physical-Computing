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

    var grid = new Grid();
    var robot = new Robot(grid);

    it('basic boundaries directions', function() {

        // Maze is randomly created. Ensure that the current cell has no barriers
        var cell = robot.getCell();
        $(cell).removeClass('wall-up wall-down wall-left wall-right');

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

    it('Obsticles', function() {
        var cell = robot.getCell();
        console.log(cell);
    });
});
