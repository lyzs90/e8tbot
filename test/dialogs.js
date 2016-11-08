var assert = require('assert');
var builder = require("botbuilder");
require("../");

//=============================================================================
// Basic Dialogs
//=============================================================================

describe("Dialogs", function() {
    it("should process a waterfall of all built-in prompt types", function (done) {
        var step = 0;
        var connector = new builder.ConsoleConnector();
        var bot = new builder.UniversalBot(connector);
        bot.dialog('/', [
            function (session) {
                assert(session.message.text == 'Hello');
                builder.Prompts.text(session, 'May I know your name?');
            },
            function (session, results) {
                assert(results.response === 'Richard');
                session.userData.name = results.response;
                builder.Prompts.number(session, "Hi " + results.response + ", How old are you?");
            },
            function (session, results) {
                assert(results.response === 42);
                session.userData.age = results.response;
                builder.Prompts.choice(session, "What is your favourite snack?", ["Koko Krunch", "Julie's Peanut Butter Sandwich", "Pepero"]);
            },
            function (session, results) {
                assert(results.response && results.response.entity === 'Koko Krunch');
                session.userData.snack = results.response.entity;
                session.send("Got it... " + session.userData.name +
                             " you are " + session.userData.age +
                             " years old and you like " + session.userData.snack + ".");
            }
        ]);
        bot.on('send', function (message) {
            switch (++step) {
                case 1:
                    assert(message.text == 'May I know your name?');
                    connector.processMessage('Richard');
                    break;
                case 2:
                    connector.processMessage('42');
                    break;
                case 3:
                    connector.processMessage('Koko Krunch');
                    break;
                case 4:
                    assert(message.text == 'Got it... Richard you are 42 years old and you like Koko Krunch.');
                    done();
                    break;
            }
        });
        connector.processMessage('Hello');
    });
});
