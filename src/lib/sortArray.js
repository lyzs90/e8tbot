'use strict';

// Helper function to calculate haversine distance
exports.haversine = (lat1, lng1, lat2, lng2) => {
    // Helper function to convert degrees to radians
    let deg2rad = (deg) => {
        return deg * (Math.PI / 180)
    };
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2 - lat1);  // deg2rad below
    let dLng = deg2rad(lng2 - lng1);
    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return d;
};

// Main function for sorting array
exports.byDistance = (session, arr, method) => {
    // Sort by haversine distance
    arr.sort((a, b) => {
        let latO = session.userData.location.latitude;
        let lngO = session.userData.location.longitude;
        let latA = a.geometry.coordinates[1];
        let lngA = a.geometry.coordinates[0];
        let latB = b.geometry.coordinates[1];
        let lngB = b.geometry.coordinates[0];

        if (method(latO, lngO, latA, lngA) < method(latO, lngO, latB, lngB)) return -1;
        if (method(latO, lngO, latA, lngA) > method(latO, lngO, latB, lngB)) return 1;
        return 0;
    });
    return arr;
};
