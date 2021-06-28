// sticky的本意是粘的，粘性的，使用其进行的布局被称为粘性布局。
// sticky是position属性新推出的值，属于CSS3的新特性，常用与实现吸附效果。
// 设置了sticky布局的元素，在视图窗口时，与静态布局的表现一致。
// 但当该元素的位置移出设置的视图范围时，其定位效果将变成fixed，并根据设置的left、top等作为其定位参数。

const vueSticky = {}
let listenAction
vueSticky.install = Vue => {
  Vue.directive('sticky', {
    inserted(el, binding) {
      const params = binding.value || {}
      const stickyTop = params.stickyTop || 0
      const zIndex = params.zIndex || 1000
      const elStyle = el.style

      elStyle.position = '-webkit-sticky'
      elStyle.position = 'sticky'
      // if the browser support css sticky（Currently Safari, Firefox and Chrome Canary）
      // if (~elStyle.position.indexOf('sticky')) {
      //     elStyle.top = `${stickyTop}px`;
      //     elStyle.zIndex = zIndex;
      //     return
      // }
      const elHeight = el.getBoundingClientRect().height
      const elWidth = el.getBoundingClientRect().width
      elStyle.cssText = `top: ${stickyTop}px; z-index: ${zIndex}`

      const parentElm = el.parentNode || document.documentElement
      const placeholder = document.createElement('div')
      placeholder.style.display = 'none'
      placeholder.style.width = `${elWidth}px`
      placeholder.style.height = `${elHeight}px`
      parentElm.insertBefore(placeholder, el)

      let active = false

      const getScroll = (target, top) => {
        const prop = top ? 'pageYOffset' : 'pageXOffset'
        const method = top ? 'scrollTop' : 'scrollLeft'
        let ret = target[prop]
        if (typeof ret !== 'number') {
          ret = window.document.documentElement[method]
        }
        return ret
      }

      const sticky = () => {
        if (active) {
          return
        }
        if (!elStyle.height) {
          elStyle.height = `${el.offsetHeight}px`
        }

        elStyle.position = 'fixed'
        elStyle.width = `${elWidth}px`
        placeholder.style.display = 'inline-block'
        active = true
      }

      const reset = () => {
        if (!active) {
          return
        }

        elStyle.position = ''
        placeholder.style.display = 'none'
        active = false
      }

      const check = () => {
        const scrollTop = getScroll(window, true)
        const offsetTop = el.getBoundingClientRect().top
        if (offsetTop < stickyTop) {
          sticky()
        } else {
          if (scrollTop < elHeight + stickyTop) {
            reset()
          }
        }
      }
      listenAction = () => {
        check()
      }

      window.addEventListener('scroll', listenAction)
    },

    unbind() {
      window.removeEventListener('scroll', listenAction)
    }
  })
}

export default vueSticky

