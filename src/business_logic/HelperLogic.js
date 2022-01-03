export function determineDistance(region,lat,lon){
    let lowLatitude = region.center.latitude - (region.span.latitudeDelta / 2)
    let highLatitude = region.center.latitude + (region.span.latitudeDelta / 2)
    let lowLongitude = region.center.longitude - (region.span.longitudeDelta / 2)
    let highLongitude = region.center.longitude + (region.span.longitudeDelta / 2)
    var centerLatitude = ((highLatitude - lowLatitude) / 2.0) + lowLatitude
    var centerLongitude = ((highLongitude - lowLongitude) / 2.0) + lowLongitude
    let distance = calcCrow(centerLatitude,centerLongitude,lat,lon)
    return distance
}

function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat_1 = toRad(lat1);
    var lat_2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat_1) * Math.cos(lat_2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    d = d/1.6
    return parseFloat(d.toFixed(1));
}

// Converts numeric degrees to radians
export function toRad(Value) {
    return Value * Math.PI / 180;
}

export function toDeg(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
}