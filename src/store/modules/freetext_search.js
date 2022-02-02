export default {
  namespaced: true,
  state: {
    text_search: "",
    search_results: [],
  },
  getters: {},
  actions: {},
  mutations: {
    setSearch(state, val) {
      state.text_search = val
      state.search_results = []
    },
    addSearchResult(state, annotations) {
      state.search_results = annotations
    },
    clearSearchResult(state) {
      state.search_results = []
    },
    // setPreventTollroads(state, val) {
    //   state.preventTollroads = val
    // },
    // setAlwaysShowTripSummary(state, val) {
    //   state.alwaysShowTripSummary = val
    // },
    // setAutoPreventBigCities(state, val) {
    //   state.autoPreventBigCities = val
    // },
    // setShowArchivedTrips(state, val) {
    //   state.showArchivedTrips = val
    // },
    // setShowSystemTrips(state, val) {
    //   state.showSystemTrips = val
    // },
    // setHideAdminFunctions(state, val) {
    //   state.hideAdminFunctions = val
    // },
    // setDefaultOriginType(state, value) {
    //   state.defaultOriginType = value
    // },
    // setShowYelpDetails(state, val) {
    //   state.showYelpDetails = val
    // },
    // setShowRVSettings(state, val) {
    //   state.showRVSettings = val
    // },
  },
}
