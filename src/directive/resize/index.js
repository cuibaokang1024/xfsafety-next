import domResize from './domResize'

const install = function(Vue) {
  Vue.directive('domResize', domResize)
}

if (window.Vue) {
  window['domResize'] = domResize
  Vue.use(install); // eslint-disable-line
}

domResize.install = install
export default domResize
