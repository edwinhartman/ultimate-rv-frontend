export default {
  namespaced: true,
  state: {
    searchPredefined: "none",
  },
  getters: {},
  actions: {},
  mutations: {
    resetSearchPredefined(state) {
      state.searchPredefined = "none"
    },
    setSearchPredefined(state, val) {
      state.searchPredefined = val
    },
  },
}
