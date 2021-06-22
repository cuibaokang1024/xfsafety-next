import { constantRoutes } from '@/router'
import { getRouteList } from '@/api/route'
import router from './router'
// import mapRouter from '@/utils/mapping'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */

function mapRouter (routers) {
  return routers.filter(itemRouter => {
    if (itemRouter.component !== 'Layout') {
      router.addRoute('BasicLayout', {
        ...itemRouter,
        component: (resolve) => require([`@/${itemRouter.component}`], resolve)

      })
    }
    // 是否存在子集
    if (itemRouter.children && itemRouter.children.length) {
      mapRouter(itemRouter.children)
    }
    return true
  })
}
const state = {
  routes: [],
  addRoutes: [],
  secondRoutes: []
}
const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_SECOND_ROUTES: (state, routes) => {
    state.secondRoutes = routes
  }
}
function getFirstPath (tree) {
  let temp = ''
  var forFn = function (arr) {
    temp = temp + `${arr.path}/`
    if (arr.children) {
      if (!arr.children[0].hidden) {
        forFn(arr.children[0])
      }
    }
  }
  forFn(tree)
  return temp.substring(0, temp.length - 1)
}
const actions = {
  generateRoutes ({ commit }) {
    return new Promise(resolve => {
      getRouteList().then(response => {
        if (response.code === 200) {
          const route = response.data.map((item) => {
            if (item.children) {
              return { ...item, redirect: getFirstPath(item) }
            } else {
              return item
            }
          })
          const accessedRoutes = mapRouter(route)
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        }
      })
    })
  },
  filterRoutes ({ commit }, id) {
    const routes = state.routes.filter((route) => {
      return !route.hidden && route.id === id
    })
    commit('SET_SECOND_ROUTES', routes)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
