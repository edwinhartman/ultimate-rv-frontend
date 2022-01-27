export default {
  namespaced: true,
  state: {
    preventTollroads: false,
    alwaysShowTripSummary: false,
    defaultOriginType: "current",
    autoPreventBigCities: false,
    showArchivedTrips: false,
    showSystemTrips: false,
    hideAdminFunctions: false,
    showYelpDetails: false,
    showRVSettings: false,
  },
  getters: {},
  actions: {},
  mutations: {
    setPreventTollroads(state, val) {
      state.preventTollroads = val
    },
    setAlwaysShowTripSummary(state, val) {
      state.alwaysShowTripSummary = val
    },
    setAutoPreventBigCities(state, val) {
      state.autoPreventBigCities = val
    },
    setShowArchivedTrips(state, val) {
      state.showArchivedTrips = val
    },
    setShowSystemTrips(state, val) {
      state.showSystemTrips = val
    },
    setHideAdminFunctions(state, val) {
      state.hideAdminFunctions = val
    },
    setDefaultOriginType(state, value) {
      state.defaultOriginType = value
    },
    setShowYelpDetails(state, val) {
      state.showYelpDetails = val
    },
    setShowRVSettings(state, val) {
      state.showRVSettings = val
    },
  },
}
