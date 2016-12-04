'use strict';

var request = require('request');

//=========================================================
// Facebook setup: node setup-fb.js
//=========================================================

// Setup persistent menu for facebook
facebookThreadAPI('./fb-persistent-menu.json', 'Persistent Menu');

// Calls the Facebook graph api to change various bot settings
function facebookThreadAPI (jsonFile, cmd) {
    // Start the request
    request({
        url: 'https://graph.facebook.com/v2.6/me/thread_settings?access_token=' + '<Your Facebook Page Access Token>',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        form: require(jsonFile)
    },
    function (error, response, body) {
        if (!error && response.statusCode === 200) {
            // Print out the response body
            console.log(cmd + ': Updated.');
            console.log(body);
        } else {
            // TODO: Handle errors
            console.log(cmd + ': Failed. Need to handle errors.');
            console.log(body);
        }
    });
}
