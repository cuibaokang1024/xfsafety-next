import axios from 'axios'
import { MessageBox, ElMessage } from 'element-plus'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建一个axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true,
  timeout: 10000
})
const CancelToken = axios.CancelToken
export const source = CancelToken.source()
// 请求发起前拦截
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers.Authorization = getToken()
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)
// 请求响应拦截
service.interceptors.response.use(
  response => {
    const res = response.data
    if (response.config.responseType === 'blob' || !res.code) {
      let fileName = ''
      if (response.headers.filename) {
        const Base64 = require('js-base64').Base64
        fileName = Base64.decode(response.headers.filename)
      }
      return { ...response, fileName }
    }
    if (res.code !== 200) {
      switch (res.code) {
        // case 401:
        //   MessageBox.confirm('您已注销，您可以取消停留在此页，或重新登录', {
        //     confirmButtonText: '重新登陆',
        //     cancelButtonText: '取消',
        //     type: 'warning'
        //   }).then(() => {
        //     store.dispatch('user/resetToken').then(() => {
        //       location.reload()
        //     })
        //   })
        //   break
        // case 403:
        //   ElMessage({
        //     ElMessage: '拒绝访问',
        //     type: 'error'
        //   })
        //   break
        // case 280:
        //   ElMessage({
        //     ElMessage: res.msg || 'error',
        //     type: 'error'
        //   })
        //   break
        // case 500:
        //   ElMessage({
        //     ElMessage: '服务器错误',
        //     type: 'error'
        //   })
        //   break
        default:
          break
      }
      ElMessage({
        message: res.msg,
        type: 'error'
      })
      return Promise.reject(res.msg || 'error')
    } else {
      return res
    }
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          MessageBox.confirm('您已注销，您可以取消停留在此页，或重新登录', {
            confirmButtonText: '重新登陆',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
          break
        case 403:
          ElMessage({
            message: '拒绝访问',
            type: 'error'
          })
          break
        // case 500:
        //  ElMessage({
        //     message: '服务器错误',
        //     type: 'error'
        //   })
        //   break
      }
    }
    return Promise.reject(error)
  }
)

export default service
