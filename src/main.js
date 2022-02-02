process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

require("dotenv").config()
import { createApp } from "vue"
import App from "./App.vue"
import store from "./store"
import router from "./router/index"
import axios from "axios"
import "./index.css"
import VueHtmlToPaper from "./components/other/VueHtmlToPaper"
import LoadScript from "vue-plugin-load-script"

import AllStates from "./definitions/AllStates"
import ErrorCodes from "./definitions/ErrorCodes"

axios.interceptors.request.use(
  (config) => {
    // console.log(process.env.VUE_APP_BACKEND_CONNECTION_URI)
    let split_url = config.url.split("/")
    if (split_url[0] + "//" + split_url[2] == process.env.VUE_APP_BACKEND_CONNECTION_URI) {
      // const https = require('https')
      // config.httpsAgent = new https.Agent({rejectUnauthorized:false})
      // Do something before request is sent
      let token = localStorage.getItem("user-token")
      if (token) {
        config.headers["Authorization"] = token //`Bearer ${ token }`;
      }
      let adminToken = localStorage.getItem("user-token-admin")
      if (adminToken) {
        config.headers["X-Admin-Authorization"] = adminToken
      }
    }
    //config.baseURL = process.env.VUE_APP_BACKEND_CONNECTION_URI;
    //    config.headers['Access-Control-Allow-Origin'] = process.env.VUE_APP_BACKEND_CONNECTION_URI;
    //    config.crossdomain = true;
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  function (response) {
    // Any status code within the range of 2xx cause this function to trigger
    // Do something with response data
    // console.log(response.status)
    return response
  },
  function (error) {
    if (error.response.status === 401) {
      store.dispatch("logoutUser")
    }
    if (error.response.status === 987) {
      // console.log(error.response)
      router.push({ path: "/checkAccount/" + error.response.status })
    }
    // Any status codes outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)

const app = createApp(App)

app.config.globalProperties.allStates = AllStates.AllStates
app.config.globalProperties.BackendErrorCodes = ErrorCodes.ErrorCodes
app.config.globalProperties.formatAmount = (amnt) => {
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })

  return formatter.format(amnt)
}
app.config.globalProperties.getDateTimeFormatted = (dateTime, msg) => {
  if (!dateTime) {
    if (msg && msg != "") {
      return msg
    } else {
      return "No date set"
    }
  } else {
    let d = new Date(dateTime)

    return d.toLocaleDateString() + " " + d.toLocaleTimeString()
  }
}
app.config.globalProperties.getDateFormatted = (dateTime, msg) => {
  if (!dateTime) {
    if (msg && msg != "") {
      return msg
    } else {
      return "No date set"
    }
  } else {
    let d = new Date(dateTime)

    return d.toLocaleDateString()
  }
}
app.config.globalProperties.zoomToTrip = (trip, store) => {
  var lowestLat = 9999999
  var lowestLon = 9999999
  var highestLat = -9999999
  var highestLon = -9999999
  let stopStartIdx = 0
  if (trip.searchPredefined != null && trip.searchPredefined) {
    lowestLat = trip.stops[0].coordinate.latitude
    highestLat = trip.stops[0].coordinate.latitude
    lowestLon = trip.stops[0].coordinate.longitude
    highestLon = trip.stops[0].coordinate.longitude
    stopStartIdx = 1
  } else {
    // lowestLat = this.$store.state.currentLocation.coords.latitude
    // highestLat = this.$store.state.currentLocation.coords.latitude
    // lowestLon = this.$store.state.currentLocation.coords.longitude
    // highestLon = this.$store.state.currentLocation.coords.longitude
    lowestLat = 999
    highestLat = -999
    lowestLon = 999
    highestLon = -999
  }

  for (let i = stopStartIdx; i < trip.stops.length; i++) {
    if (trip.stops[i].coordinate.latitude < lowestLat) {
      lowestLat = trip.stops[i].coordinate.latitude
    }
    if (trip.stops[i].coordinate.latitude > highestLat) {
      highestLat = trip.stops[i].coordinate.latitude
    }
    if (trip.stops[i].coordinate.longitude < lowestLon) {
      lowestLon = trip.stops[i].coordinate.longitude
    }
    if (trip.stops[i].coordinate.longitude > highestLon) {
      highestLon = trip.stops[i].coordinate.longitude
    }
  }
  if (trip.polyline.length > 0) {
    for (let i = 0; i < trip.polyline.length; i++) {
      for (let j = 0; j < trip.polyline[i].length; j++) {
        if (trip.polyline[i][j][0] < lowestLat) {
          lowestLat = trip.polyline[i][j][0]
        }
        if (trip.polyline[i][j][0] > highestLat) {
          highestLat = trip.polyline[i][j][0]
        }
        if (trip.polyline[i][j][1] < lowestLon) {
          lowestLon = trip.polyline[i][j][1]
        }
        if (trip.polyline[i][j][1] > highestLon) {
          highestLon = trip.polyline[i][j][1]
        }
      }
    }
  }

  var centerLat = (highestLat - lowestLat) / 2 + lowestLat
  var centerLon = (highestLon - lowestLon) / 2 + lowestLon
  var diffLat = (highestLat - lowestLat) * 1.1
  var diffLon = (highestLon - lowestLon) * 1.1
  store.commit("setNewMapRegion", {
    centerLat: centerLat,
    centerLon: centerLon,
    diffLat: diffLat,
    diffLon: diffLon,
  })
}
app.config.globalProperties.$axios = axios

// const htp_options = {
//   name: "_blank",
//   specs: ["fullscreen=yes", "titlebar=no", "scrollbars=yes"],
//   styles: [window.location.href + "static/css/print_style.css"],
//   timeout: 1000,
//   autoClose: true,
//   windowTitle: window.document.title,
// }
app.use(store).use(router).use(VueHtmlToPaper).use(LoadScript).mount("#app")
