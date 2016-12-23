'use strict';

var sinon = require('sinon');
const expect = require('chai').expect;
const createDeck = require('../dist/lib/createDeck');
const builder = require('botbuilder');

var session = {};
var tmpDeck = [];
var docs = [];

describe('Create Deck', () => {
    it('should return an array', () => {
        var stub = sinon.stub(builder, 'HeroCard').returns({});
        var tmpDeck2 = createDeck(session, tmpDeck, docs, 1);  // side effect is to create an array from a list of objects
        stub.restore();
        expect(tmpDeck2).to.be.a('array');
    });
});
