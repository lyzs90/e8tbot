const restify = require('restify');
const builder = require('botbuilder');
const mongodb = require('mongodb');
const assert = require('assert');
const findDocuments = require('./lib/findDocuments');
const createDeck = require('./lib/createDeck');

//=============================================================================
// Database Setup
//=============================================================================

// Connect to MongoDB
const uri = process.env.MONGODB_URI;

//=============================================================================
// Bot Setup
//=============================================================================

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978,
    () => console.log('%s listening to %s', server.name, server.url)
);

// Create chat bot
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
const bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
const model = `https://api.projectoxford.ai/luis/v1/application?id=\
${process.env.LUIS_ID}&subscription-key=${process.env.LUIS_SUB_KEY}`;
const recognizer = new builder.LuisRecognizer(model);
const intents = new builder.IntentDialog({ recognizers: [recognizer] });

//=============================================================================
// Bot Dialogs
//=============================================================================

// Welcome Dialog
bot.dialog('/', [
    (session) => {
        // Send a card TODO: handle hi or weird reponses
        let card = new builder.HeroCard(session)
            .title("Hi, I am Coconut")
            .text("Your friendly neighbourhood food hunting bot")
            .images([
                 builder.CardImage.create(session, "https://s21.postimg.org/i8h4uu0if/logo_cropped.png")
            ]);
        let msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.send("If you would like me to recommend something nearby, just shout out your location :)");
        session.beginDialog('/food');
    }
]);

// Intents Dialog
bot.dialog('/food', intents);

// Respond to answers like 'no', 'bye', 'goodbye', 'thank you'
intents.matches('SayBye', [
    (session, args) => {
        /* istanbul ignore next  */
        setTimeout ( () => session.send("Alright, let me know if you need anything else."), 2000);
        session.endDialog();
    }
]);

// Respond to answers like 'i hate <food>', 'don't want to eat <food>'
intents.matches('SomethingElse', [
    (session, args) => {
        let task = builder.EntityRecognizer.findEntity(args.entities, 'Food');
        /* istanbul ignore next  */
        setTimeout ( () => session.send(`Ah, something other than ${task.entity}?`), 2000);
        session.beginDialog('/food');
    }
]);

// Respond to answers like 'i want to eat <food>', '<food>', '<location>'
intents.matches('FindNearby', [
    (session, args) => {

        // If Location TODO: add support for food queries
        let task = builder.EntityRecognizer.findEntity(args.entities, 'Location');
        session.send(`Searching for... ${task.entity}`);

        // Parameterized query TODO: add validation for queryString
        let regex = new RegExp(`^${task.entity}$`, 'i');
        let selector = { "search" : regex };

        // Execute MongoDB query
        mongodb.MongoClient.connect(uri, (err, db) => {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            findDocuments(db, process.env.MONGODB_COLLECTION, selector, (docs) => {
                // Create deck of cards
                let tmpDeck = [];
                createDeck(session, tmpDeck, docs);
                let msg = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(tmpDeck);

                // Show deck as a carousel
                session.send(msg);
                db.close();
            });
        });

        /* istanbul ignore next  */
        setTimeout ( () => session.send("What else would you like to search for?"), 5000);
            session.beginDialog('/food');
    }

]);

intents.onDefault(builder.DialogAction.send("I'm sorry, I didn't quite get that. Please state your location."));
