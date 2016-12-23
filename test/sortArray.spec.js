'use strict';

const expect = require('chai').expect;
const sortArray = require('../dist/lib/sortArray');

let session = {
    userData: {
        location: {
            elevation: 0,
            latitude: 1.42957603931427,
            longitude: 103.8493881225586,
            type: 'GeoCoordinates'
        }
    }
};

let geo1 = {'name': 'city hall', 'geometry': {'type': 'Point', 'coordinates': [103.85098234639, 1.2843399429976]}};

let geo2 = {'name': 'tampines', 'geometry': {'type': 'Point', 'coordinates': [103.94501945588, 1.3543091664208]}};

let geo3 = {'name': 'yishun', 'geometry': {'type': 'Point', 'coordinates': [103.83749344028, 1.4271233105526]}}

let geo4 = {'name': 'choa chu kang', 'geometry': {'type': 'Point', 'coordinates': [103.7393911, 1.3877357]}};

let arr = [geo1, geo2, geo3, geo4];

describe('Sort Array', () => {
    it('should sort an array of geocoordinates by distance from a ref point', () => {
        var sortedArr = sortArray.byDistance(session, arr, sortArray.haversine);
        expect(sortedArr).to.deep.equal([geo3, geo4, geo2, geo1]);
    });
});
