import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, logout, getInfo } from '@/api/user'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userName: '',
  officeName: '',
  photoUrl: '',
  areaName: '',
  avatar: '',
  officeId: '',
  introduction: '',
  officeType: -1,
  buttons: [],
  roles: [],
  settings: [],
  mqttTopics: [],
  isAdmin: 0, // 超级管理员
  isSocial: 0, // 监管单位
  isFire: 0, // 消防主管单位
  isIndustry: 0, // 行业主管单位
  isGov: 0, // 下级政府
  isAgency: 0, // 合作商
  isGrid: 0, // 网格员
  isBuild: 0, // 高层建筑人员
  isParty: 0, // 党委政府
  isCentralOffice: 0, // 总账号
  detailData: {},
  roleName: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_USER_NAME: (state, name) => {
    state.userName = name
  },
  SET_OFFICE_NAME: (state, name) => {
    state.officeName = name
  },
  SET_PHOTO_URL: (state, photoUrl) => {
    state.photoUrl = photoUrl
  },
  SET_AREA_NAME: (state, name) => {
    state.areaName = name
  },
  SET_AREA_ID: (state, id) => {
    state.areaId = id
  },
  SET_OFFICE_ID: (state, id) => {
    state.officeId = id
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_BUTTONS: (state, buttons) => {
    state.buttons = buttons
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_SETTINGS: (state, settings) => {
    state.settings = settings
  },
  SET_OFFICE_TYPE: (state, type) => {
    state.officeType = type
  },
  SET_MQTT_TOPICS: (state, topics) => {
    state.mqttTopics = topics
  },
  SET_IS_ADMIN: (state, isAdmin) => { // 超级管理员
    state.isAdmin = isAdmin
  },
  SET_IS_CENTRAL_OFFICE: (state, isCentralOffice) => { // 超级管理员
    state.isCentralOffice = isCentralOffice
  },
  SET_IS_SOCIAL: (state, isSocial) => { // 监管单位
    state.isSocial = isSocial
  },
  SET_IS_FIRE: (state, isFire) => { // 消防主管单位
    state.isFire = isFire
  },
  SET_IS_INDUSTRY: (state, isIndustry) => { // 行业主管单位
    state.isIndustry = isIndustry
  },
  SET_IS_GOV: (state, isGov) => { // 下级政府
    state.isGov = isGov
  },
  SET_IS_AGENCY: (state, isAgency) => { // 合作商
    state.isAgency = isAgency
  },
  SET_IS_GRID: (state, isGrid) => { // 网格员
    state.isGrid = isGrid
  },
  SET_IS_BUILD: (state, isBuild) => { // 高层建筑人员
    state.isBuild = isBuild
  },
  SET_IS_PARTY: (state, isParty) => { // 党委政府
    state.isParty = isParty
  },
  SET_AGENT_TREE: (state, payload) => {
    state.detailData = payload
  },
  SET_ROLE_NAME: (state, payload) => {
    state.roleName = payload
  }
}

const actions = {
  // 用户登录
  login ({ commit }, userInfo) {
    const { loginName, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ loginName: loginName.trim(), password: password }).then(response => {
        const data = response.data
        commit('SET_TOKEN', data.jwt)
        setToken(data.jwt)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取用户信息
  getInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject(new Error('Verification failed, please Login again.'))
        }
        const { officeType, officeId, userName, photoUrl, officeName, roleName, areaName, areaId, mqttTopics, isCentralOffice, isAdmin, isSocial, isFire, isIndustry, isGov, isAgency, isGrid, isBuild, isParty } = data
        commit('SET_OFFICE_TYPE', officeType)
        commit('SET_OFFICE_ID', officeId)
        commit('SET_USER_NAME', userName)
        commit('SET_PHOTO_URL', photoUrl)
        commit('SET_OFFICE_NAME', officeName)
        commit('SET_AREA_NAME', areaName)
        commit('SET_MQTT_TOPICS', mqttTopics)
        commit('SET_IS_CENTRAL_OFFICE', isCentralOffice)
        commit('SET_IS_ADMIN', isAdmin)
        commit('SET_IS_SOCIAL', isSocial)
        commit('SET_IS_FIRE', isFire)
        commit('SET_IS_INDUSTRY', isIndustry)
        commit('SET_IS_GOV', isGov)
        commit('SET_IS_AGENCY', isAgency)
        commit('SET_IS_GRID', isGrid)
        commit('SET_IS_BUILD', isBuild)
        commit('SET_IS_PARTY', isParty)
        commit('SET_AREA_ID', areaId)
        commit('SET_ROLE_NAME', roleName)
        // commit('SET_INTRODUCTION', introduction)
        // commit('SET_BUTTONS', buttons)
        // commit('SET_SETTINGS', settings)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 退出登录
  logout ({ commit, dispatch, state }) {
    return new Promise((resolve, reject) => {
      logout().then(response => {
        dispatch('tagsView/delAllViews', null, { root: true })
        commit('SET_TOKEN', '')
        commit('SET_OFFICE_TYPE', -1)
        commit('SET_OFFICE_ID', '')
        commit('SET_BUTTONS', [])
        commit('SET_USER_NAME', '')
        commit('SET_AREA_NAME', '')
        commit('SET_AREA_ID', '')
        commit('SET_OFFICE_NAME', '')
        commit('SET_PHOTO_URL', '')
        commit('SET_MQTT_TOPICS', '')
        commit('SET_IS_ADMIN', 0)
        commit('SET_IS_SOCIAL', 0)
        commit('SET_IS_FIRE', 0)
        commit('SET_IS_INDUSTRY', 0)
        commit('SET_IS_GOV', 0)
        commit('SET_IS_AGENCY', 0)
        commit('SET_IS_GRID', 0)
        commit('SET_IS_BUILD', 0)
        commit('SET_IS_PARTY', 0)
        commit('SET_ROLE_NAME', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 删除token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_OFFICE_TYPE', -1)
      commit('SET_OFFICE_ID', '')
      commit('SET_BUTTONS', [])
      removeToken()
      resolve()
    })
  },
  setAgentTree ({ commit }, payload) {
    commit('SET_AGENT_TREE', payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
