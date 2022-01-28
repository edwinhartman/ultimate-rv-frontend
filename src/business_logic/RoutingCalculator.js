import axios from "axios"

export function calculateTripHERE(state, callback) {
  // console.log(state.currentLocation.coords.latitude)
  axios({
    url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/calculateRoute",
    method: "post",
    data: {
      trip: state.activeTrip,
      rv: state.activeRV,
      preventTollroads: state.settings.preventTollroads,
      currentLocation: {
        coords: {
          latitude: state.currentLocation.coords.latitude,
          longitude: state.currentLocation.coords.longitude,
        },
      },
    },
  }).then((res) => {
    // console.log(res.data.polylines)
    callback(res.data.routes, res.data.polylines)
  })
}
export async function calculateDayTripsHERE(state, callback) {
  // console.log(state.currentLocation.coords.latitude)
  if (state.activeTrip.stops.length > 2 && state.activeTrip.stops.find((s) => s.daytrip == true)) {
    let routes = [[]]
    let polylines = [[]]
    for (let i = 1; i < state.activeTrip.stops.length - 1; i++) {
      if (state.activeTrip.stops[i].daytrip) {
        let parentStop = state.activeTrip.stops[i]
        for (let j = i; j > -1; j--) {
          if (!state.activeTrip.stops[j].daytrip) {
            parentStop = state.activeTrip.stops[j]
            break
          }
        }
        let stops = [parentStop]
        stops.push(state.activeTrip.stops[i])
        stops.push(parentStop)
        let trip = {
          name: "Daytrip - " + parentStop + " to " + state.activeTrip.stops[i],
          origin: parentStop.coordinate,
          stops: stops,
          dates: [],
          notes: [],
          firstStopIsDeparture: true,
          areasToAvoid: [],
          polyline: [],
          summary: [],
          actions: [],
          speeds: [],
          tolls: [],
          active: false,
          archived: false,
          system: false,
        }
        for (let i = 0; i < trip.stops.length; i++) {
          trip.stops[i].daytrip = false
        }
        await axios({
          url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/calculateRoute",
          method: "post",
          data: {
            trip: trip,
            // rv: null,
            preventTollroads: state.settings.preventTollroads,
            currentLocation: {
              coords: {
                latitude: parentStop.coordinate.latitude,
                longitude: parentStop.coordinate.longitude,
              },
            },
          },
        }).then((res) => {
          // console.log(res.data.polylines)
          // callback(res.data.routes, res.data.polylines)
          routes.push(res.data.routes)
          polylines.push(res.data.polylines)
        })
      } else {
        routes.push([])
        polylines.push([])
      }
    }
    // routes.push([])
    // polylines.push([])
    // console.log(routes)
    callback(routes, polylines)
  } else {
    callback(null, null)
  }
}
