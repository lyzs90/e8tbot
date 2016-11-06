var assert = require('assert');
var builder = require("botbuilder");

// Fake Test
var app = require("../app");
describe("Bot Responses", function() {
  it("Says hello", function() {
    var message = app.testStub();
    assert(message == "Success!");
  });
});

//=============================================================================
// Basic Dialogs
//=============================================================================

describe("Dialogs", function() {
    this.timeout(5000);
    it("should process a waterfall of all built-in prompt types", function (done) {
        var step = 0;
        var connector = new builder.ConsoleConnector();
        var bot = new builder.UniversalBot(connector);
        bot.dialog('/', [
            function (session) {
                assert(session.message.text == 'start');
                builder.Prompts.text(session, 'May I know your name?');
            },
            function (session, results) {
                assert(results.response === 'some text');
                builder.Prompts.number(session, 'enter a number');
            },
            function (session, results) {
                assert(results.response === 42);
                builder.Prompts.choice(session, 'pick a color', 'red|green|blue');
            },
            function (session, results) {
                assert(results.response && results.response.entity === 'green');
                builder.Prompts.confirm(session, 'Is green your choice?');
                session.send('done');
            }
        ]);
        bot.on('send', function (message) {
            switch (++step) {
                case 1:
                    assert(message.text == 'May I know your name?');
                    connector.processMessage('some text');
                    break;
                case 2:
                    connector.processMessage('42');
                    break;
                case 3:
                    connector.processMessage('green');
                    done();
                    break;
            }
        });
        connector.processMessage('start');
    });
});
