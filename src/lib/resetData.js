'use strict';

// Helper function to reset session/results data
let resetData = (session, results) => {
    results = {};
    session.userData.location = {};
    session.userData.selector = {};
    session.userData.cursor = 0;
    session.userData.count = 0;
}

module.exports = resetData;
