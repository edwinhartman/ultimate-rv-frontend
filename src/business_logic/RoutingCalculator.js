import axios from 'axios'

export function calculateTripHERE(state, callback) {
    axios({
        url:process.env.VUE_APP_BACKEND_CONNECTION_URI + '/calculateRoute',
        method:'post',
        data:{
            trip:state.activeTrip,
            rv:state.activeRV,
            preventTollroads:state.preventTollroads,
            currentLocation:state.currentLocation
        }
    }).then((res)=>{
        callback(res.data.routes)
    })
}