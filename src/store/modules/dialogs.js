export default {
  namespaced: true,
  state: {
    showTripTolls: false,
    showTripSummary: false,
    showTripDirections: false,
    showTripCalendar: false,
    showAbout: false,
    routeCalculateInProcess: false,
    showOpenExistingTrip: false,
    accountMaintenanceActive: false,
    showPicture: null,
    presentAlternativeData: null,
  },
  getters: {},
  actions: {},
  mutations: {
    setShowTripTolls(state, show) {
      state.showTripTolls = show
    },
    setShowTripSummary(state, val) {
      state.showTripSummary = val
    },
    setShowTripDirections(state, show) {
      state.showTripDirections = show
    },
    setShowTripCalendar(state, val) {
      state.showTripCalendar = val
    },
    setShowAbout(state, show) {
      state.showAbout = show
    },
    setTripCalculateInProcess(state, active) {
      state.routeCalculateInProcess = active
    },
    setShowOpenExistingTrip(state, val) {
      state.showOpenExistingTrip = val
    },
    setShowAccountMaintenance(state, val) {
      console.log("setShowAccountMaintenance - " + val)
      state.accountMaintenanceActive = val
    },
    clearShowPicture(state) {
      state.showPicture = null
    },
    setShowPicture(state, value) {
      state.showPicture = value
    },
    clearAlternativeStopData(state) {
      state.presentAlternativeData = null
    },
    setAlternativeStopData(state, data) {
      state.presentAlternativeData = data
    },
  },
}
