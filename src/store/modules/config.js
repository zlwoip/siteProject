const upsConfigString = localStorage.getItem('upsConfig')
const upsConfig = JSON.parse(upsConfigString || '{}')
const switchboardConfigString = localStorage.getItem('switchboardConfig')
const switchboardConfig = JSON.parse(switchboardConfigString || '{}')
const state = {
  upsConfig: upsConfig,
  switchboardConfig: switchboardConfig
}

const getters = {
  getUpsConfig(state) {
    return state.upsConfig
  },
  getSwitchboardConfig(state) {
    return state.switchboardConfig
  }
}

const actions = {
  saveUpsConfig({ commit }, data) {
    return new Promise((resolve, reject) => {
      try {
        commit('SAVE_UPS_CONFIG', data)
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  },
  saveSwitchboardConfig({ commit }, data) {
    return new Promise((resolve, reject) => {
      try {
        commit('SAVE_SWITECHBOARD_CONFIG', data)
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }
}

const mutations = {
  SAVE_UPS_CONFIG(state, data) {
    state.upsConfig = data
    localStorage.setItem('upsConfig', JSON.stringify(data))
  },
  SAVE_SWITECHBOARD_CONFIG(state, data) {
    state.switchboardConfig = data
    localStorage.setItem('switchboardConfig', JSON.stringify(data))
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
