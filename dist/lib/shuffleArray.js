"use strict";

var shuffleArray = function shuffleArray(array) {
    var currentIndex = array.length;
    var temporaryValue = void 0;
    var randomIndex = void 0;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

module.exports = shuffleArray;