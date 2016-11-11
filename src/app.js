var restify = require('restify');
var builder = require('botbuilder');
var firebase = require('firebase');
var https = require('https');

//=============================================================================
// Database Setup
//=============================================================================

// Initialize Firebase
var config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_PID + ".firebaseapp.com",
  databaseURL: "https://" + process.env.FIREBASE_PID + ".firebaseio.com",
  storageBucket: "gs://" + process.env.FIREBASE_PID + ".appspot.com",
};
firebase.initializeApp(config);
var database = firebase.database();

//=============================================================================
// Bot Setup
//=============================================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978,
    () => console.log('%s listening to %s', server.name, server.url)
);

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var model = 'https://api.projectoxford.ai/luis/v1/application?id=' + process.env.LUIS_ID + '&subscription-key=' + process.env.LUIS_SUB_KEY;
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });

//=============================================================================
// Bot Dialogs
//=============================================================================

bot.dialog('/', [
    (session) => {
        session.send("Hi there, I'm Coconut. Let me know what food you're craving and I'll point you in the right direction. If you would like me to recommend something nearby, just shout out your location :)");
        session.beginDialog('/food');
    }
]);

bot.dialog('/food', intents);
intents
    .matches('FindNearby', [
        (session, args) => {
            var task = builder.EntityRecognizer.findEntity(args.entities, 'Food');
            session.send("Finding... " + task.entity);

            // Stub Firebase Request.
            //TODO: use Firebase retrieval instead of https.get
            //      options: craving + location, just location
            var req = https.get('https://coconut-c63fc.firebaseio.com/searches/0/result/extractorData/data/0/group/0/Name/0/text.json', (res) => {
              console.log(res.statusCode);
              res.on('data', (chunk) => session.send(JSON.parse(chunk)) );
            });

            req.on('error', (e) => {
              console.error(e);
            });
            //

            setTimeout ( () => session.send("Is there something else you would like to eat?"), 2000);
        }
    ])
    .onDefault(builder.DialogAction.send("I'm sorry, I didn't quite get that. What's that you were craving for again?"));
