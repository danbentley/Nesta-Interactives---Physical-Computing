define(['src/grid', 'src/robot', 'src/app'], function(Grid, Robot, App) {

    jasmine.getFixtures().fixturesPath = 'base/test/fixtures';
    loadFixtures('index.html');

    describe('When a grid is created', function() {

        var app = new App();
        app.init();

        var grid = new Grid();
        beforeEach(function() {
            grid.loadMaze({
                up:{},
                down:{},
                left:{},
                right:{},
                goal:{ x:8, y:8 }
            });
            grid.init();
        });

        xit('should contain items', function() {
            var itemCount = $('span.item').length;
            expect(itemCount > 0).toBeTruthy();
        });

        xit('should have a goal', function() {
            var $goal = $('span.goal');
            expect($goal.length > 0).toBeTruthy();
        });
    });
});
