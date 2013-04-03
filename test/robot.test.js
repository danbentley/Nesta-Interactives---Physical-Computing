define(['src/grid', 'src/robot'], function(Grid, Robot) {

    jasmine.getFixtures().fixturesPath = 'base/test/fixtures';
    loadFixtures('index.html');

    describe('When a robot moves to the goal', function() {

        var grid = new Grid(),
            robot = new Robot(grid);
        grid.loadMaze({
            up:{},
            down:{},
            left:{},
            right:{},
            goal:{ x:9, y:9 }
        });
        grid.init();

        beforeEach(function() {
            // Maze is randomly created. Ensure that the current cell has no barriers
            var cells = grid.getCells();
            $.each(cells, function() {
                grid.addWallForDirection($(this), 'up');
            })
            cells.find('.wall').addClass('goal');
        });

        it('can move to goal', function() {
            var position = { x: 1, y: 1 };

            var $cell = grid.getCellForPosition(position);
            var containsWall = robot.doesCellContainWallInDirection($cell, 'up');
            expect(containsWall).toBeTruthy();

            var containsGoal = robot.doesCellContainGoalInDirection($cell, 'up');
            expect(containsGoal).toBeTruthy();

            var canMoveToPosition = robot.canMoveToPosition(position, 'up');
            expect(canMoveToPosition).toBeTruthy();
        });

        it('an event should be triggered', function() {
            var spy = spyOnEvent(window, 'robot.wins');
            robot.right();
            robot.move();
            expect('robot.wins').toHaveBeenTriggeredOn(window);
        });
    });
});
