/*
'use strict';

const expect = require('chai').expect;
const createDeck = require('../dist/lib/createDeck');

let session = {
    userData: {
        location: {
            longitude: 'testLng',
            latitude: 'testLat'
        }
    }
};
let tmpDeck = [];
let docs = [
    {properties: {
        name: [{text: 'testName'}],
        category: [{text: 'testCategory'}],
        rating: [{text: 'testRating'}],
        address: [{text: 'testAddress'}],
        image: [{src: 'testImage'}]
    }}
];

describe('Create Deck', () => {
    it('should return an array of HeroCard objects', () => {
        createDeck(session, tmpDeck, docs, 1);
        expect(tmpDeck).to.be.a('array');
    });
    it('should contain parameters extracted from the docs', () => {
        expect(tmpDeck[0].data.content.title).to.equal('testName');
        expect(tmpDeck[0].data.content.subtitle).to.equal('testCategory, testRating, testAddress');
    });
});
*/
