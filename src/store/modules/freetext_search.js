export default {
  namespaced: true,
  state: {
    searchKeywords: "",
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
    updateKeywords(state, value) {
      state.searchKeywords = value
    },
  },
}
