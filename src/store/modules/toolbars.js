export default {
  namespaced: true,
  state: {
    showLeftToolbar: false,
  },
  getters: {},
  actions: {},
  mutations: {
    setShowLeftToolbar(state, val) {
      state.showLeftToolbar = val
    },
  },
}
