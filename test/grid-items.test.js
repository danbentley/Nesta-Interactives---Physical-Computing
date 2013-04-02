define(['grid', 'robot'], function(Grid, Robot) {

    jasmine.getFixtures().fixturesPath = 'base/test/fixtures';
    loadFixtures('index.html');

    describe('When a grid is created', function() {

        var grid = new Grid();
        grid.init();

        it('should contain items', function() {
            var itemCount = $('span.item').length;
            expect(itemCount).toBeTruthy(itemCount > 0);
        });

        it('should have a goal', function() {
            var $goal = $('span.goal');
            expect($goal).toBeTruthy($goal.length > 0);
        });
    });
});
