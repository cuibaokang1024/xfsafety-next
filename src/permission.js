import router from './router'
import store from './store'
import { source } from '@/utils/request'
import addRouters from '@/utils/addRouters'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress' // 进度条
// import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 从cookie获取Token
import getPageTitle from '@/utils/get-page-title'
NProgress.configure({ showSpinner: false }) // NProgress配置
const whiteList = ['/login', '/auth-redirect', '/appChkSupervision/chkPreview'] // 无重定向白名单

router.beforeEach(async (to, from, next) => {
  // 进度条开始
  NProgress.start()
  source.cancel()
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已登录
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，请重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 确定用户是否已通过getInfo获得用户信息
      const hasOfficeType = store.getters.officeType !== -1
      if (hasOfficeType) {
        next()
      } else {
        try {
          // 获取用户信息
          await store.dispatch('user/getInfo')
          // 基于角色生成可访问路由图
          const accessRouters = await store.dispatch('permission/generateRoutes')
          // // 动态添加可访问路由
          addRouters(accessRouters)
          console.log(router.getRoutes())
          // hack method to ensure that addRoutes is complete
          // 设置replace:true，这样导航就不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          console.log(error)
          // 移除Token并转到登录页以重新登录
          await store.dispatch('user/resetToken')
          ElMessage.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 没有token */
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单中，直接进入
      next()
    } else {
      // 没有访问权限的其他页将重定向到登录页。
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 进度条结束
  NProgress.done()
})
