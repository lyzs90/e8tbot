'use strict';

var builder = require('botbuilder');

var createDeck = function createDeck(session, tmpDeck, arr, numCards) {
    arr.slice(0, numCards).forEach(function (result) {
        var tmpCard = [new builder.HeroCard(session).title(result.properties.name[0].text).subtitle(result.properties.category[0].text + ', ' + result.properties.rating[0].text + ', ' + result.properties.address[0].text).images([builder.CardImage.create(session, result.properties.image[0].src).tap(builder.CardAction.showImage(session, result.properties.image[0].src))]).buttons([builder.CardAction.openUrl(session, result.properties.name[0].href, 'Reviews')])];
        tmpDeck.push.apply(tmpDeck, tmpCard);
    });
    return tmpDeck;
};

module.exports = createDeck;