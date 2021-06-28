import scrollBottom from './scrollBottom'

const install = function(Vue) {
  Vue.directive('scrollBottom', scrollBottom)
}

if (window.Vue) {
  window['scrollBottom'] = scrollBottom
  Vue.use(install); // eslint-disable-line
}

scrollBottom.install = install
export default scrollBottom
