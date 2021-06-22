const state = {
  electricLatestData: {},
  isSubscribeElectric: false,
  alertMsgData: {}
}

const mutations = {
  SET_ELECTRIC_LATEST_DATA: (state, data) => {
    state.electricLatestData = data
  },
  SET_IS_SUBSCRIBE_ELECTRIC: (state, data) => {
    state.isSubscribeElectric = data
  },
  SET_ALERT_MSG_DATA: (state, data) => {
    state.alertMsgData = data
  }
}

const actions = {
  changeElectricLatestData ({ commit }, data) {
    commit('SET_ELECTRIC_LATEST_DATA', data)
  },
  changeIsSubscribeElectric ({ commit }, data) {
    commit('SET_IS_SUBSCRIBE_ELECTRIC', data)
  },
  changeAlertMsgData ({ commit }, data) {
    commit('SET_ALERT_MSG_DATA', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
