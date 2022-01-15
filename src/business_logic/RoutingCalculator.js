import axios from 'axios'

export function calculateTripHERE(state, callback) {
    console.log(state.currentLocation.coords.latitude)
    axios({
        url:process.env.VUE_APP_BACKEND_CONNECTION_URI + '/calculateRoute',
        method:'post',
        data:{
            trip:state.activeTrip,
            rv:state.activeRV,
            preventTollroads:state.preventTollroads,
            currentLocation:{
                coords:{
                    latitude:state.currentLocation.coords.latitude,
                    longitude:state.currentLocation.coords.longitude
                }
            }
        }
    }).then((res)=>{
        callback(res.data.routes)
    })
}