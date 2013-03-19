describe("ParseCommands tests", function() {

    it("Parse basic commands (non-repeatable)", function() {
        var commandString = 'left\n right\n up\n down';
        var commands = parseCommandString(commandString);
        expect(commands.length).toEqual(4);
    });

    it("Parse repeatable commands", function() {
        var commandString = 'left\n right\n move(10)';
        var commands = parseCommandString(commandString);
        expect(commands.length).toEqual(12);
        expect(commands.indexOf('move(10)')).toBe(-1);
    });

    it("Parse repeatable commands in middle of list", function() {
        var commandString = 'left\n right\n move(10)\n up\n down';
        var commands = parseCommandString(commandString);
        expect(commands.length).toEqual(14);
        expect(commands.indexOf('move(10)')).toBe(-1);
    });
});

describe("Robots tests", function() {
    var grid = $('fake');
    var robot = new Robot(grid);

    it("Check that robot exists", function() {
        expect(robot).not.toBeNull();
    });
});
