describe("A suite", function() {

  var robot = new Robot();
  alert(robot);

  it("Check that robot exists", function() {
    expect(robot).toBe(true);
  });
});
