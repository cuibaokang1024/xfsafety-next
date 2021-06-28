import btnPermission from './btnPermission'

const install = function(Vue) {
  Vue.directive('btnPermission', btnPermission)
}

if (window.Vue) {
  window['btnPermission'] = btnPermission
  Vue.use(install); // eslint-disable-line
}

btnPermission.install = install
export default btnPermission
