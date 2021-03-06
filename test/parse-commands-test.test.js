define(['src/app', 'src/robot', 'src/grid'], function(App, Robot, Grid) {

    jasmine.getFixtures().fixturesPath = 'base/test/fixtures';
    loadFixtures('index.html');

    describe('ParseCommands tests', function() {

        var app = new App();
        app.init();

        it('Parse basic commands (non-repeatable)', function() {
            var commandString = 'left\n right\n up\n down';
            var commands = app.parseCommandString(commandString);
            expect(commands.length).toEqual(4);
        });

        it('Parse repeatable commands', function() {
            var commandString = 'left\n right\n move(10)';
            var commands = app.parseCommandString(commandString);
            expect(commands.length).toEqual(12);
            expect(commands.indexOf('move(10)')).toBe(-1);
        });

        it('Parse repeatable commands in middle of list', function() {
            var commandString = 'left\n right\n move(10)\n up\n down';
            var commands = app.parseCommandString(commandString);
            expect(commands.length).toEqual(14);
            expect(commands.indexOf('move(10)')).toBe(-1);
        });

        it('Parse multiple moves', function() {
            var commandString = 'move(1)\n up\n move(2)\n down\n move(3)\n left\n move(4)\n right';
            var commands = app.parseCommandString(commandString);
            expect(commands.length).toEqual(14);

            // Not sure whether this test works
            expect(commands.indexOf('move(1)')).toBe(-1);
            expect(commands.indexOf('move(2)')).toBe(-1);
            expect(commands.indexOf('move(3)')).toBe(-1);
            expect(commands.indexOf('move(4)')).toBe(-1);
            expect(commands).toEqual([
                'move',
                'up',
                'move',
                'move',
                'down',
                'move',
                'move',
                'move',
                'left',
                'move',
                'move',
                'move',
                'move',
                'right'
            ]);
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

        if('Cell for position', function() {
            var fetchedCellUp = grid.getCellForPosition({ x: 1, y: 0 });
            expect($(fetchedCellUp).attr('id')).toEqual('grid-1-0');
        });

        if('Start position', function() {
            var cell = robot.getCell();
            expect($(cell).attr('id')).toEqual('grid-1-1');
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

        it('should use boundaries defined by the grid', function() {
            var grid = new Grid({
                x:33,
                y:17
            });

            expect(grid.isPositionWithinBounds({ x:32, y:16 })).toBeTruthy();
            expect(grid.isPositionWithinBounds({ x:33, y:17 })).toBeFalsy();
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

        it('Test opposite direction', function() {
            var oppositeDirection = robot.getOppositeDirection('up');
            expect(oppositeDirection).toEqual('down');

            var oppositeDirection = robot.getOppositeDirection('down');
            expect(oppositeDirection).toEqual('up');

            var oppositeDirection = robot.getOppositeDirection('left');
            expect(oppositeDirection).toEqual('right');

            var oppositeDirection = robot.getOppositeDirection('right');
            expect(oppositeDirection).toEqual('left');
        });

        it('Test opposite walls', function() {
            var cellUp = grid.getCellForPosition({ x: 1, y: 0 });
            expect(cellUp).not.toBeNull();
            $(cellUp).addClass('wall-down');
            expect(cellUp).toHaveClass('wall-down');

            var canMoveToPosition = robot.canMoveToPosition({ x: 1, y: 0 }, 'up');
            expect(canMoveToPosition).toBeFalsy();
        });

        it('should return the relative degrees to turn when facing up', function() {
            var currentDirection = 'up';
            expect(robot.getDegreesToFromDirection('left', currentDirection)).toEqual(270);
            expect(robot.getDegreesToFromDirection('down', currentDirection)).toEqual(180);
            expect(robot.getDegreesToFromDirection('right', currentDirection)).toEqual(90);
        });

        it('should return the relative degrees to turn when facing down', function() {
            currentDirection = 'down';
            expect(robot.getDegreesToFromDirection('up', currentDirection)).toEqual(180);
            expect(robot.getDegreesToFromDirection('left', currentDirection)).toEqual(90);
            expect(robot.getDegreesToFromDirection('right', currentDirection)).toEqual(270);
        });

        it('should return the relative degrees to turn when facing left', function() {
            currentDirection = 'left';
            expect(robot.getDegreesToFromDirection('up', currentDirection)).toEqual(90);
            expect(robot.getDegreesToFromDirection('right', currentDirection)).toEqual(180);
            expect(robot.getDegreesToFromDirection('down', currentDirection)).toEqual(270);
        });

        it('should return the relative degrees to turn when facing right', function() {
            currentDirection = 'right';
            expect(robot.getDegreesToFromDirection('down', currentDirection)).toEqual(90);
            expect(robot.getDegreesToFromDirection('left', currentDirection)).toEqual(180);
            expect(robot.getDegreesToFromDirection('up', currentDirection)).toEqual(270);
        });
    });
});
