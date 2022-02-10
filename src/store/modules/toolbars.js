export default {
  namespaced: true,
  state: {
    showLeftToolbar: false,
    showRightToolbar: true,
  },
  getters: {},
  actions: {},
  mutations: {
    setShowLeftToolbar(state, val) {
      state.showLeftToolbar = val
    },
    setShowRightToolbar(state, val) {
      state.showRightToolbar = val
    },
  },
}
