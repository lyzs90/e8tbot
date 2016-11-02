var expect = require("chai").expect;
var app = require("../app");

describe("Bot Responses", function() {
  it("Says hello", function() {
    var message = app.testStub();

    expect(message).to.equal("Success!");
  });
});
