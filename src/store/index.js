import { createStore } from 'vuex'
import axios from 'axios'
import VuexPersistence from 'vuex-persist'
import flexible_polyline from '../helpers/flexible_polyline'
import { calculateRouteHERE } from '../business_logic/RoutingCalculator'
import router from '../router/index'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default createStore({
  state: {
    searchKeywords: "",
    routes: [],
    activeRoute: null,
    currentLocation: null,
    token: localStorage.getItem("user-token") || "",
    adminToken: localStorage.getItem("user-token-admin") || null,
    rvs: [],
    activeRV: null,
    summaries: [],
    searchPredefined: "none",
    mapRegion: null,
    showRouteDirections: false,
    showAbout: false,
    preventTollroads: false,
    showRouteTolls: false,
    routeCalculateInProcess: false,
    alwaysShowRouteSummary: false,
    showRouteSummary: false,
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
    showArchivedRoutes:false,
    showSystemRoutes:false,
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
    setShowRouteSummary(state, val) {
      state.showRouteSummary = val
    },
    setPreventTollroads(state, val) {
      state.preventTollroads = val
    },
    setAlwaysShowRouteSummary(state, val) {
      state.alwaysShowRouteSummary = val
    },
    setShowYelpDetails(state, val) {
      state.showYelpDetails = val
    },
    setAutoPreventBigCities(state,val){
      state.autoPreventBigCities = val
    },
    setShowArchivedRoutes(state,val){
      state.showArchivedRoutes = val
    },
    setShowSystemRoutes(state,val){
      state.showSystemRoutes = val
    },
    setHideAdminFunctions(state,val){
      state.hideAdminFunctions = val
    },
    setShowRVSettings(state,val){
      state.showRVSettings = val
    },
    resetValues(state) {
      state.searchKeywords = ""
      state.activeRoute = null
      state.summaries = []
    },
    resetCurrentRoute(state) {
      state.summaries = []
      state.activeRoute.polyline = []
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
    addRoute(state, value) {
      value.startLocation = state.currentLocation
      value.stops = []
      value.polyline = []
      state.routes.push(value)
      if (value.active) {
        state.activeRoute = value
      }
    },
    loadRoutes(state, value) {
      state.routes = value
      if (state.routes != null) {
        if (state.routes.length == 0) {
          state.activeRoute = null;
        } else {
          for (let i = 0; i < state.routes.length; i++) {
            if (state.routes[i].active) {
              state.activeRoute = state.routes[i]
              state.summaries = state.routes[i].summary
            }
          }
        }
      }
    },
    setCurrentLocation(state, value) {
      state.currentLocation = value
      if (state.activeRoute != null && state.activeRoute.startLocation == null) {
        state.activeRoute.startLocation = value
      }
    },
    addStop(state, value) {
      state.activeRoute.stops.push(value)
    },
    clearPolyline(state) {
      state.activeRoute.polyline = []
    },
    clearSummaries(state) {
      state.summaries = []
    },
    clearActions(state) {
      state.activeRoute.actions = []
    },
    clearSpeeds(state) {
      state.activeRoute.speeds = []
    },
    clearTolls(state) {
      state.activeRoute.tolls = []
    },
    clearShowPicture(state) {
      state.showPicture = null
    },
    setShowPicture(state, value) {
      state.showPicture = value
    },
    addPolyline(state, value) {
      state.activeRoute.polyline.push(value)
    },
    updateRouteName(state, payload) {
      state.routes[payload.idx].name = payload.newName
    },
    updateStopList(state, newList) {
      state.activeRoute.stops = newList
      state.summaries = []
      state.activeRoute.polyline = []
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
      state.activeRoute.actions.push(value)
    },
    addSpeeds(state, value) {
      state.activeRoute.speeds.push(value)
    },
    addTolls(state, value) {
      state.activeRoute.tolls.push(value)
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
    setShowRouteDirections(state, show) {
      state.showRouteDirections = show
    },
    setShowAbout(state, show) {
      state.showAbout = show
    },
    setShowRouteTolls(state, show) {
      state.showRouteTolls = show
    },
    setDefaultOriginType(state,value){
      state.defaultOriginType = value
    },
    setRouteCalculateInProcess(state, active) {
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
      state.activeRoute = null
      state.currentLocation = null
      state.rvs = []
      state.activeRV = null
      state.summaries = []
      state.searchPredefined = "none"
      state.mapRegion = null
      state.showRouteDirections = false
      state.showAbout = false
      state.preventTollroads = false
      state.showRouteTolls = false
      state.routeCalculateInProcess = false
      state.alwaysShowRouteSummary = false
      state.showRouteSummary = false
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
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + '/updateRoute',
        data: {
          route: value
        }
      }).then((res) => {
        commit('loadRoutes', res.data.routes)
      }).catch((err) => { console.log(err) })
    },
    addRouteStop({ commit }, value) {
      commit('addStop', value)
      commit('clearPolyline')
      commit('clearSummaries')
      commit('clearActions')

      axios({
        method: 'post',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + '/updateRoute',
        data: {
          route: this.state.activeRoute
        }
      }).then((res) => {
        commit('setSearchPredefined', "None")
        commit('loadRoutes', res.data.routes)
      }).catch((err) => { console.log(err) })

    },
    updateRouteName({ commit }, payload) {
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
          commit('updateRouteName', { idx: idx, newName: payload.newValue })
          axios({
            method: 'post',
            url: process.env.VUE_APP_BACKEND_CONNECTION_URI + '/updateRoute',
            data: {
              route: this.state.routes[idx]
            }
          }).then((res) => {
            commit('loadRoutes', res.data.routes)
          }).catch((err) => { console.log(err) })
        }
      }
    },
    setAsOrigin({ commit }, payload) {
      commit('resetCurrentRoute')
      payload.route.route.firstStopIsDeparture = payload.isOrigin
      axios({
        method: 'post',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + '/updateRoute',
        data: {
          route: payload.route.route
        }
      }).then((res) => {
        commit('loadRoutes', res.data.routes)
      }).catch((err) => { console.log(err) })
    },
    calculateRoute({ commit }, route) {
      if (this.state.currentLocation != null) {
        commit('setRouteCalculateInProcess', true)
        commit('clearPolyline')
        commit('clearSummaries')
        commit('clearActions')
        commit('clearSpeeds')
        commit('clearTolls')

        calculateRouteHERE(this.state, (routes) => {
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
                commit('setRouteCalculateInProcess', false)
              }
            }



            axios({
              method: 'post',
              url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/addPolylineSummaryActionsTollsSpeeds",
              data: {
                route_id: this.state.activeRoute._id,
                polyline: this.state.activeRoute.polyline,
                summary: this.state.summaries,
                actions: this.state.activeRoute.actions,
                tolls: this.state.activeRoute.tolls,
                speeds: this.state.activeRoute.speeds
              }
            }).then((res1) => {
              commit('loadRoutes', res1.data.routes)
            })
          } else {
            commit('setRouteCalculateInProcess', false)
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
              this.state.alwaysShowRouteSummary = res.data.settings.filter((e)=>{ return Object.keys(e)[0] == "alwaysShowRouteSummary" })[0].alwaysShowRouteSummary
              this.state.showYelpDetails = res.data.settings.filter((e)=>{ return Object.keys(e)[0] == "showYelpDetails"})[0].showYelpDetails
              this.state.autoPreventBigCities = res.data.settings.filter((e)=>{ return Object.keys(e)[0] == "autoPreventBigCities"})[0].autoPreventBigCities
              this.state.showArchivedRoutes = res.data.settings.filter((e)=>{ return Object.keys(e)[0] == "showArchivedRoutes"})[0].showArchivedRoutes
              this.state.hideAdminFunctions = res.data.settings.filter((e)=>{ return Object.keys(e)[0] == "hideAdminFunctions"})[0].hideAdminFunctions
              this.state.showSystemRoutes = res.data.settings.filter((e)=>{ return Object.keys(e)[0] == "showSystemRoutes"})[0].showSystemRoutes
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
    removeStopFromRoute({ commit }, payload) {
      axios({
        method: 'post',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + '/removeStopFromRoute',
        data: {
          payload
        }
      }).then((res) => {
        commit('loadRoutes', res.data.routes)
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
    addBlankRoute({ commit }) {
      axios({
        method: 'get',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + '/addBlankRoute?addBigCities=' + this.state.autoPreventBigCities
      }).then((res) => {
        commit('loadRoutes', res.data.routes)
      })
    },
    activateRoute({ commit }, id) {
      return new Promise((resolve,reject)=>{
      commit('resetValues')
      axios({
        method: 'post',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + '/activateRoute',
        data: {
          id
        }
      }).then((res) => {
        commit('loadRoutes', res.data.routes)
          resolve()
        
      })
    })
    },
    copyActiveRouteToReverse({ commit }) {
      axios({
        method: 'post',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/copyActiveRouteToReverse",
        data: { route: this.state.activeRoute }
      }).then((res) => {
        commit('loadRoutes', res.data.routes)
      })
    },
    removeRoute({ commit }, id) {
      axios({
        method: 'post',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/removeRoute",
        data: { route_id: id }
      }).then((res) => {
        commit('loadRoutes', res.data.routes)
      })
    },
    archiveRoute({ commit }, id) {
      axios({
        method: 'post',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/archiveRoute",
        data: { route_id: id }
      }).then((res) => {
        commit('loadRoutes', res.data.routes)
      })
    },
    restoreRoute({ commit }, id) {
      axios({
        method: 'post',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/restoreRoute",
        data: { route_id: id }
      }).then((res) => {
        commit('loadRoutes', res.data.routes)
      })
    },
    addAreaToAvoid({ commit }, payload) {
      axios({
        method: 'post',
        url: process.env.VUE_APP_BACKEND_CONNECTION_URI + "/addAreaToAvoid",
        data: { route_id: payload.id, points: payload.points }
      }).then((res) => {
        commit('loadRoutes', res.data.routes)
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
        commit('loadRoutes', res.data.routes)
      })
    },
    editRouteStopDate({commit},payload){
      commit('setEditStopDateStop',payload)
    },
    updateRouteStopDate({commit},payload){
      axios({
        method:'post',
        url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/updateRouteStopDate",
        data:{
          route_id:payload.route_id,
          stop_id: payload.stop_id,
          date:payload.date
        }
      }).then((res)=>{
        commit('clearEditStopDateStop')
        commit('loadRoutes',res.data.routes)
      })
    },
    setRouteAsSystemRoute({commit},payload){
      axios({
        method:'post',
        url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/updateRouteToSystemRoute",
        data:{
          route_id:payload.route_id
        }
      }).then((res)=>{
        commit('loadRoutes',res.data.routes)
      })
    },
    saveUserSettings({commit}){
      let settings = [
        {"preventTollroads":this.state.preventTollroads},
        {"alwaysShowRouteSummary":this.state.alwaysShowRouteSummary},
        {"showYelpDetails":this.state.showYelpDetails},
        {"autoPreventBigCities":this.state.autoPreventBigCities},
        {"showArchivedRoutes":this.state.showArchivedRoutes},
        {"hideAdminFunctions":this.state.hideAdminFunctions},
        {"showSystemRoutes":this.state.showSystemRoutes},
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
