'use strict';

const expect = require('chai').expect;
const createDeck = require('../dist/lib/createDeck');

let session;
let tmpDeck = [];
let docs = [
    {results: [
        {
            Name: [{text: 'testName'}],
            Category: [{text: 'testCategory'}],
            Rating: [{text: 'testRating'}],
            Address: [{text: 'testAddress'}],
            Image: [{text: 'testImage'}]
        }
    ]}
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
