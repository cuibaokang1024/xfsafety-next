import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const myBtns = store.getters && store.getters.buttons
    if (value) {
      const permissionBtn = value
      const hasPermission = myBtns.some(btn => {
        return permissionBtn === btn
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles!`)
    }
  }
}
