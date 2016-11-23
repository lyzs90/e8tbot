'use strict';

var builder = require('botbuilder');

var createDeck = function createDeck(session, tmpDeck, docs, numCards, callback) {
    var arr = callback(docs[0].results);
    arr.slice(0, numCards).forEach(function (result) {
        var tmpCard = [new builder.HeroCard(session).title(result.Name[0].text).subtitle(result.Category[0].text + ', ' + result.Rating[0].text + ', ' + result.Address[0].text).images([builder.CardImage.create(session, result.Image[0].src).tap(builder.CardAction.showImage(session, result.Image[0].src))]).buttons([builder.CardAction.openUrl(session, result.Image[0].href, 'Reviews')])];
        tmpDeck.push.apply(tmpDeck, tmpCard);
    });
};

module.exports = createDeck;