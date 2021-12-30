import axios from 'axios'

export function calculateRouteHERE(state, callback) {
    var url = 'https://router.hereapi.com/v8/routes?transportMode=truck&origin='
    var stopStartIdx = 0
    if (state.activeRoute.firstStopIsDeparture) {
        url += state.activeRoute.stops[0].coordinate.latitude + ',' +
            state.activeRoute.stops[0].coordinate.longitude
        stopStartIdx = 1
    } else {
        url += state.currentLocation.coords.latitude + ',' +
            state.currentLocation.coords.longitude
    }
    url += '&destination=' + state.activeRoute.stops[state.activeRoute.stops.length - 1].coordinate.latitude + ',' +
        state.activeRoute.stops[state.activeRoute.stops.length - 1].coordinate.longitude;
    if (state.activeRoute.stops.length > 1) {
        for (let i = stopStartIdx; i < state.activeRoute.stops.length - 1; i++) {
            url += "&via=" + state.activeRoute.stops[i].coordinate.latitude + "," + state.activeRoute.stops[i].coordinate.longitude
        }
    }
    if (state.activeRoute.areasToAvoid != null &&
        state.activeRoute.areasToAvoid.length > 0) {
        url += "&avoid[areas]="
        let areasToAvoid = state.activeRoute.areasToAvoid
        for (let i = 0; i < areasToAvoid.length; i++) {
            if (i > 0) {
                url += "|"
            }
            url += "bbox:" + areasToAvoid[i].point2.longitude + "," + areasToAvoid[i].point2.latitude +
                "," + areasToAvoid[i].point4.longitude + "," + areasToAvoid[i].point4.latitude
        }
    }
    if (state.preventTollroads) {
        url += "&avoid[features]=tollRoad"
    }

    url += '&units=imperial'
    url += '&alternatives=0'
    url += '&routingMode=short'

    //console.log(state.activeRV)
    if (state.activeRV != null) {
        url += "&vehicle[speedCap]=" + parseInt(state.activeRV.maxspeed.toFixed(2) * 0.44704)
        url += "&truck[length]=" + (((parseInt(state.activeRV.length.feet) * 12) + parseInt(state.activeRV.length.inch)) * 2.54).toFixed(0)
        url += "&truck[width]=" + (((parseInt(state.activeRV.width.feet) * 12) + parseInt(state.activeRV.width.inch)) * 2.54).toFixed(0)
        url += "&truck[height]=" + (((parseInt(state.activeRV.height.feet) * 12) + parseInt(state.activeRV.height.inch)) * 2.54).toFixed(0)
        url += "&truck[grossWeight]=" + ((parseInt(state.activeRV.weight) + 10000) * 0.453592).toFixed(0)
        if (state.activeRV.rvtype == "motorhome") {
            url += "&truck[type]=straight"
        } else {
            url += "&truck[type]=tractor"
            url += "&truck[trailerCount]=1"
        }
    }
    url += '&return=polyline,summary,typicalDuration,actions,instructions,tolls'
    url += '&spans=speedLimit'
    url += '&apiKey=' + process.env.VUE_APP_HERE_API

    console.log(url)
    axios({
        method: 'GET',
        url: url
    }).then((res) => {
        for (var i=0;i<res.data.routes.length;i++){
            for (var j=0;j<res.data.routes[i].sections.length;j++){
                res.data.routes[i].sections[j].summary.duration =
                    parseInt(res.data.routes[i].sections[j].summary.length / (0.9 * parseFloat(state.activeRV.maxspeed) * 0.44704))
            }
        }
        callback(res.data.routes)
    }).catch((err) => {
        console.log(err)
        callback(null)
    })
}