define(['src/grid', 'src/robot'], function(Grid, Robot) {


    jasmine.getFixtures().fixturesPath = 'base/test/fixtures';
    loadFixtures('index.html');

    var grid,
        robot;
    beforeEach(function() {
        grid = new Grid();
        robot = new Robot(grid);

        grid.loadMaze({
            up:{},
            down:{},
            left:{},
            right:{},
            goal:{ x:9, y:9 }
        });
        grid.init();
    });

    describe('When a robot moves to a cell with an item', function() {

        beforeEach(function() {
            expect(robot.itemCount).toBe(1);
            // The direction is never switched due to the transition plugins
            // callback never firing in the turnToDirection() method
            // instead of mocking the transit object, just manually
            // update the property
            robot.down();
            robot.direction = 'down';
            robot.move();
        });

        it('should be removed', function() {
            var $cell = robot.getCell();
            expect($cell.children('span')).not.toHaveClass('item');
        });

        it('the item counter should increment', function() {
            expect(robot.itemCount).toBe(2);
        });
    });

    describe('when a robot starts on a cell with an item', function() {
        it('should be removed', function() {
            var $cell = robot.getCell();
            expect($cell.children('span')).not.toHaveClass('item');
        });
    });
});
