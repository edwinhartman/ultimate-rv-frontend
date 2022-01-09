import { createStore } from 'vuex'
import axios from 'axios'
import VuexPersistence from 'vuex-persist'
import flexible_polyline from '../helpers/flexible_polyline'
import { calculateTripHERE } from '../business_logic/RoutingCalculator'
import router from '../router/index'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default createStore({
  state: {
    searchKeywords: "",
    routes: [],
    activeTrip: null,
    currentLocation: null,
    token: localStorage.getItem("user-token") || "",
    adminToken: localStorage.getItem("user-token-admin") || null,
    rvs: [],
    activeRV: null,
    summaries: [],
    searchPredefined: "none",
    mapRegion: null,
    showTripDirections: false,
    showAbout: false,
    preventTollroads: false,
    showTripTolls: false,
    routeCalculateInProcess: false,
    alwaysShowTripSummary: false,
    showTripSummary: false,
    sharedSearchMarkers: [],
    showPicture: null,
    showYelpDetails: false,
    accountMaintenanceActive: false,
    showAnnotationDetails: null,
    showAnnotationDetailsAvailable:0,
    editStopDateActive:false,
    editStopDateStop:null,
    defaultOriginType:"current",
    autoPreventBigCities:false,
    showArchivedTrips:false,
    showSystemTrips:false,
    hideAdminFunctions:false,
    showRVSettings:false
  },
  mutations: {
    resetAllHungupValues(state) {
      state.routeCalculateInProcess = false
      state.accountMaintenanceActive = false
      state.editStopDateActive = false
    },
    setShowAccountMaintenance(state, val) {
      state.accountMaintenanceActive = val
    },
    setShowAnnotationDetails(state, val) {
      // console.log("store: " + val.title)
      state.showAnnotationDetailsAvailable = 0
      if (val == null) {
        state.showAnnotationDetails = null
      } else {
        state.showAnnotationDetails = {
          "title": val.title,
          "subtitle": val.subtitle,
          "coordinate": {
            "latitude": val.coordinate.latitude,
            "longitude": val.coordinate.longitude
          }
        }
        state.showAnnotationDetailsAvailable = Math.random() * 1000
      }
    },
    setShowTripSummary(state, val) {
      state.showTripSummary = val
    },
    setPreventTollroads(state, val) {
      state.preventTollroads = val
    },
    setAlwaysShowTripSummary(state, val) {
      state.alwaysShowTripSummary = val
    },
    setShowYelpDetails(state, val) {
      state.showYelpDetails = val
    },
    setAutoPreventBigCities(state,val){
      state.autoPreventBigCities = val
    },
    setShowArchivedTrips(state,val){
      state.showArchivedTrips = val
    },
    setShowSystemTrips(state,val){
      state.showSystemTrips = val
    },
    setHideAdminFunctions(state,val){
      state.hideAdminFunctions = val
    },
    setShowRVSettings(state,val){
      state.showRVSettings = val
    },
    resetValues(state) {
      state.searchKeywords = ""
      state.activeTrip = null
      state.summaries = []
    },
    resetCurrentTrip(state) {
      state.summaries = []
      state.activeTrip.polyline = []
    },
    resetSearchPredefined(state) {
      state.searchPredefined = "none"
    },
    setSearchPredefined(state, val) {
      state.searchPredefined = val
    },
    updateKeywords(state, value) {
      state.searchKeywords = value
    },
    addTrip(state, value) {
      value.startLocation = state.currentLocation
      value.stops = []
      value.polyline = []
      state.routes.push(value)
      if (value.active) {
        state.activeTrip = value
      }
    },
    loadTrips(state, value) {
      state.routes = value
      if (state.routes != null) {
        if (state.routes.length == 0) {
          state.activeTrip = null;
        } else {
          for (let i = 0; i < state.routes.length; i++) {
            if (state.routes[i].active) {
              state.activeTrip = state.routes[i]
              state.summaries = state.routes[i].summary
            }
          }
        }
      }
    },
    setCurrentLocation(state, value) {
      state.currentLocation = value
      if (state.activeTrip != null && state.activeTrip.startLocation == null) {
        state.activeTrip.startLocation = value
      }
    },
    addStop(state, value) {
      state.activeTrip.stops.push(value)
    },
    clearPolyline(state) {
      state.activeTrip.polyline = []
    },
    clearSummaries(state) {
      state.summaries = []
    },
    clearActions(state) {
      state.activeTrip.actions = []
    },
    clearSpeeds(state) {
      state.activeTrip.speeds = []
    },
    clearTolls(state) {
      state.activeTrip.tolls = []
    },
    clearShowPicture(state) {
      state.showPicture = null
    },
    setShowPicture(state, value) {
      state.showPicture = value
    },
    addPolyline(state, value) {
      state.activeTrip.polyline.push(value)
    },
    updateTripName(state, payload) {
      state.routes[payload.idx].name = payload.newName
    },
    updateStopList(state, newList) {
      state.activeTrip.stops = newList
      state.summaries = []
      state.activeTrip.polyline = []
    },
    authenticationSuccess(state, resp) {
      //state.status = "success";
      state.token = resp.data.token;
      if (resp.data.adminToken != null){
        state.adminToken = resp.data.adminToken
      }else{
        state.adminToken = null
      }
    },
    loadRVs(state, value) {
      state.rvs = value
      if (state.rvs.length == 0) {
        state.activeRV = null
      } else {
        for (let i = 0; i < state.rvs.length; i++) {
          if (state.rvs[i].active) {
            state.activeRV = state.rvs[i]
            break
          }
        }
      }
    },
    addSummary(state, value) {
      state.summaries.push(value)
    },
    addActions(state, value) {
      state.activeTrip.actions.push(value)
    },
    addSpeeds(state, value) {
      state.activeTrip.speeds.push(value)
    },
    addTolls(state, value) {
      state.activeTrip.tolls.push(value)
    },
    setActiveRV(state, rv) {
      state.activeRV = rv
    },
    setNewMapRegion(state, payload) {
      state.mapRegion = {
        center: {
          latitude: payload.centerLat,
          longitude: payload.centerLon
        },
        span: {
          latitudeSpan: (payload.diffLat * 1.05),
          longitudeSpan: (payload.diffLon * 1.05)
        }
      }
    },
    setMapType(state, val) {
      state.mapType = val
    },
    setShowTripDirections(state, show) {
      state.showTripDirections = show
    },
    setShowAbout(state, show) {
      state.showAbout = show
    },
    setShowTripTolls(state, show) {
      state.showTripTolls = show
    },
    setDefaultOriginType(state,value){
      state.defaultOriginType = value
    },
    setTripCalculateInProcess(state, active) {
      state.routeCalculateInProcess = active
    },
    clearSharedSearchMarkers(state) {
      state.sharedSearchMarkers = []
    },
    setSharedSearchMarkers(state, markers) {
      state.sharedSearchMarkers = markers
    },
    setEditStopDateStop(state,payload){
      state.editStopDateStop = payload
      state.editStopDateActive = true
    },
    clearEditStopDateStop(state){
      state.editStopDateStop = null
      state.editStopDateActive = false
    },
    logoutUser(state){
      state.token = ""
      state.adminToken = null
      
      state.searchKeywords = ""
      state.routes = []
      state.activeTrip = null
      state.currentLocation = null
      state.rvs = []
      state.activeRV = null
      state.summaries = []
      state.searchPredefined = "none"
      state.mapRegion = null
      state.showTripDirections = false
      state.showAbout = false
      state.preventTollroads = false
      state.showTripTolls = false
      state.routeCalculateInProcess = false
      state.alwaysShowTripSummary = false
      state.showTripSummary = false
      state.sharedSearchMarkers = []
      state.showPicture = null
      state.showYelpDetails = false
      state.accountMaintenanceActive = false
      state.showAnnotationDetails = null
      state.showAnnotationDetailsAvailable = 0
      state.editStopDateActive = false
      state.editStopDateStop = null
      state.defaultOriginType = "current"
      state.autoPreventBigCities = false
      
    }

  },
  actions: {
    logoutUser({commit}){
      commit("logoutUser")
      localStorage.removeItem("user-token");
      localStorage.removeItem("user-token-admin");
      router.go()
    },
    setSharedSearchMarkers({ commit }, markers) {
      commit('clearSharedSearchMarkers')
      commit('setSharedSearchMarkers', markers)
    },
    setActiveRV({ commit }, rv_id) {
      for (let i = 0; i < this.state.rvs.length; i++) {
        if (this.state.rvs[i]._id == rv_id) {
          commit('setActiveRV', this.state.rvs[i])
          break
        }
      }
      axios({
        method: 'post',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + '/setActiveRV',
        data: {
          id: rv_id
        }
      }).then((res) => {
        commit('loadRVs', res.data.rvs)
      }).catch((err) => { console.log(err) })
    },
    updateStopList({ commit }, value) {
      commit('clearPolyline')
      commit('clearSummaries')
      commit('clearActions')

      axios({
        method: 'post',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + '/updateTrip',
        data: {
          route: value
        }
      }).then((res) => {
        commit('loadTrips', res.data.routes)
      }).catch((err) => { console.log(err) })
    },
    addTripStop({ commit }, value) {
      commit('addStop', value)
      commit('clearPolyline')
      commit('clearSummaries')
      commit('clearActions')

      axios({
        method: 'post',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + '/updateTrip',
        data: {
          route: this.state.activeTrip
        }
      }).then((res) => {
        commit('setSearchPredefined', "None")
        commit('loadTrips', res.data.routes)
      }).catch((err) => { console.log(err) })

    },
    updateTripName({ commit }, payload) {
      if (typeof payload.newValue == "string") {
        let idx = -1
        for (let i = 0; i < this.state.routes.length; i++) {
          //console.log(state.routes[i].name)
          if (this.state.routes[i]._id == payload.identifier) {
            idx = i
            break
          }
        }
        if (idx > -1) {
          commit('updateTripName', { idx: idx, newName: payload.newValue })
          axios({
            method: 'post',
            url: process.env.VUE_APP_BACKEND_CONNECTION_URI + '/updateTrip',
            data: {
              route: this.state.routes[idx]
            }
          }).then((res) => {
            commit('loadTrips', res.data.routes)
          }).catch((err) => { console.log(err) })
        }
      }
    },
    setAsOrigin({ commit }, payload) {
      commit('resetCurrentTrip')
      payload.route.route.firstStopIsDeparture = payload.isOrigin
      axios({
        method: 'post',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + '/updateTrip',
        data: {
          route: payload.route.route
        }
      }).then((res) => {
        commit('loadTrips', res.data.routes)
      }).catch((err) => { console.log(err) })
    },
    calculateTrip({ commit }, route) {
      if (this.state.currentLocation != null) {
        commit('setTripCalculateInProcess', true)
        commit('clearPolyline')
        commit('clearSummaries')
        commit('clearActions')
        commit('clearSpeeds')
        commit('clearTolls')

        calculateTripHERE(this.state, (routes) => {
          if (routes != null) {
            for (let r = 0; r < routes.length; r++) {
              for (let i = 0; i < routes[r].sections.length; i++) {
                commit('addPolyline', flexible_polyline.decode(routes[r].sections[i].polyline).polyline)
                commit('addSummary', routes[r].sections[i].summary)
                commit('addActions', routes[r].sections[i].actions)
                commit('addSpeeds', routes[r].sections[i].spans)
                var tolls = []
                if (routes[r].sections[i].tolls != null) {
                  tolls = routes[r].sections[i].tolls
                }
                commit('addTolls', tolls)
                commit('setTripCalculateInProcess', false)
              }
            }



            axios({
              method: 'post',
              url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/addPolylineSummaryActionsTollsSpeeds",
              data: {
                route_id: this.state.activeTrip._id,
                polyline: this.state.activeTrip.polyline,
                summary: this.state.summaries,
                actions: this.state.activeTrip.actions,
                tolls: this.state.activeTrip.tolls,
                speeds: this.state.activeTrip.speeds
              }
            }).then((res1) => {
              commit('loadTrips', res1.data.routes)
            })
          } else {
            commit('setTripCalculateInProcess', false)
          }
        })

      }
    },
    authenticateUser({ commit, dispatch }, user) {
      return new Promise((resolve, reject) => {
        //commit(AUTH_REQUEST);
        axios({
          method: 'POST',
          url: process.env.VUE_APP_BACKEND_CONNECTION_URI + '/auth',
          data: user
        }).then((res) => {
          if (res.data.authenticated && res.data.token) {
            localStorage.setItem("user-token", res.data.token);
            if (res.data.adminToken) {
              localStorage.setItem("user-token-admin", res.data.adminToken);
            }
            if (res.data.settings != null && res.data.settings.length > 0){

              this.state.preventTollroads = res.data.settings.filter(e => { return Object.keys(e)[0] === "preventTollroads"})[0].preventTollroads
              this.state.alwaysShowTripSummary = res.data.settings.filter((e)=>{ return Object.keys(e)[0] == "alwaysShowTripSummary" })[0].alwaysShowTripSummary
              this.state.showYelpDetails = res.data.settings.filter((e)=>{ return Object.keys(e)[0] == "showYelpDetails"})[0].showYelpDetails
              this.state.autoPreventBigCities = res.data.settings.filter((e)=>{ return Object.keys(e)[0] == "autoPreventBigCities"})[0].autoPreventBigCities
              this.state.showArchivedTrips = res.data.settings.filter((e)=>{ return Object.keys(e)[0] == "showArchivedTrips"})[0].showArchivedTrips
              this.state.hideAdminFunctions = res.data.settings.filter((e)=>{ return Object.keys(e)[0] == "hideAdminFunctions"})[0].hideAdminFunctions
              this.state.showSystemTrips = res.data.settings.filter((e)=>{ return Object.keys(e)[0] == "showSystemTrips"})[0].showSystemTrips
              this.state.defaultOriginType = res.data.settings.filter((e)=>{ return Object.keys(e)[0] == "defaultOriginType"})[0].defaultOriginType
              if (res.data.settings.filter((e)=>{ return Object.keys(e)[0] == "showRVSettings"})){
                this.state.showRVSettings = res.data.settings.filter((e)=>{ return Object.keys(e)[0] == "showRVSettings"})[0].showRVSettings
              }
              
            }
            // axios.defaults.headers.common['Authorization'] = resp.token
            commit('authenticationSuccess', res);
            resolve(res);
            // router.go()
            //console.log(localStorage.getItem("user-token"));
          } else {
            // commit(AUTH_ERROR, "Authentication failed");
            // dispatch(USER_ERROR);
            localStorage.removeItem("user-token");
            reject("Authentication failed");
          }
        }).catch((err) => {
          console.log(err)
          // commit(AUTH_ERROR, err);
          // localStorage.removeItem("user-token");
          reject(err);
        });
      });
    },
    removeStopFromTrip({ commit }, payload) {
      axios({
        method: 'post',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + '/removeStopFromTrip',
        data: {
          payload
        }
      }).then((res) => {
        commit('loadTrips', res.data.routes)
      }).catch((err) => { console.log(err) })
    },
    addRV({ commit }, payload) {
      axios({
        method: 'post',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + '/addRV',
        data: {
          payload
        }
      }).then((res) => {
        commit('loadRVs', res.data.rvs)
      })
    },
    updateRV({ commit }, payload) {
      axios({
        method: 'post',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + '/updateRV',
        data: {
          payload
        }
      }).then((res) => {
        commit('loadRVs', res.data.rvs)
      })
    },
    loadRVs({ commit }) {
      axios({
        method: 'get',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + '/getRVs'
      }).then((res) => {
        commit('loadRVs', res.data.rvs)
      })
    },
    resetValues({ commit }) {
      commit('resetValues')
    },
    addBlankTrip({ commit }) {
      axios({
        method: 'get',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + '/addBlankTrip?addBigCities=' + this.state.autoPreventBigCities
      }).then((res) => {
        commit('loadTrips', res.data.routes)
      })
    },
    activateTrip({ commit }, id) {
      return new Promise((resolve,reject)=>{
      commit('resetValues')
      axios({
        method: 'post',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + '/activateTrip',
        data: {
          id
        }
      }).then((res) => {
        commit('loadTrips', res.data.routes)
          resolve()
        
      })
    })
    },
    copyActiveTripToReverse({ commit }) {
      axios({
        method: 'post',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/copyActiveTripToReverse",
        data: { route: this.state.activeTrip }
      }).then((res) => {
        commit('loadTrips', res.data.routes)
      })
    },
    removeTrip({ commit }, id) {
      axios({
        method: 'post',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/removeTrip",
        data: { route_id: id }
      }).then((res) => {
        commit('loadTrips', res.data.routes)
      })
    },
    archiveTrip({ commit }, id) {
      axios({
        method: 'post',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/archiveTrip",
        data: { route_id: id }
      }).then((res) => {
        commit('loadTrips', res.data.routes)
      })
    },
    restoreTrip({ commit }, id) {
      axios({
        method: 'post',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/restoreTrip",
        data: { route_id: id }
      }).then((res) => {
        commit('loadTrips', res.data.routes)
      })
    },
    addAreaToAvoid({ commit }, payload) {
      axios({
        method: 'post',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/addAreaToAvoid",
        data: { route_id: payload.id, points: payload.points }
      }).then((res) => {
        commit('loadTrips', res.data.routes)
      })
    },
    removeAreaToAvoid({ commit }, payload) {
      axios({
        method: 'post',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/removeAreaToAvoid",
        data: {
          route_id: payload.id, points: payload.points
        }
      }).then((res) => {
        commit('loadTrips', res.data.routes)
      })
    },
    editTripStopDate({commit},payload){
      commit('setEditStopDateStop',payload)
    },
    updateTripStopDate({commit},payload){
      axios({
        method:'post',
        url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/updateTripStopDate",
        data:{
          route_id:payload.route_id,
          stop_id: payload.stop_id,
          date:payload.date
        }
      }).then((res)=>{
        commit('clearEditStopDateStop')
        commit('loadTrips',res.data.routes)
      })
    },
    setTripAsSystemTrip({commit},payload){
      axios({
        method:'post',
        url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/admin/updateTripToSystemTrip",
        data:{
          route_id:payload.route_id
        }
      }).then((res)=>{
        commit('loadTrips',res.data.routes)
      })
    },
    saveUserSettings({commit}){
      let settings = [
        {"preventTollroads":this.state.preventTollroads},
        {"alwaysShowTripSummary":this.state.alwaysShowTripSummary},
        {"showYelpDetails":this.state.showYelpDetails},
        {"autoPreventBigCities":this.state.autoPreventBigCities},
        {"showArchivedTrips":this.state.showArchivedTrips},
        {"hideAdminFunctions":this.state.hideAdminFunctions},
        {"showSystemTrips":this.state.showSystemTrips},
        {"defaultOriginType":this.state.defaultOriginType},
        {"showRVSettings":this.state.showRVSettings}
      ]
      
      axios({
        method:'post',
        url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/saveUserSettings",
        data:{
          settings:settings
        }
      }).then((res)=>{
        
      })
    }

  },
  modules: {
  },
  getters: {
    isAuthenticated: (state) => {
      return !!state.token
    },
    isAuthenticatedAdmin: (state)=>{
      return !!state.adminToken
    }
  },
  plugins: [vuexLocal.plugin, store => { store.dispatch('resetValues') }]
})
