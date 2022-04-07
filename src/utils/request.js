import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // 发送跨域请求时携带 cookie 和 session，后端要配置相应的 cors
  timeout: 10000 // request timeout
})

// axios.defaults.retry = 4
// service.defaults.retryDelay = 1000

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    const statusCode = res.code || response.status // 直接获取http相应码而不再去data里获取code
    // 未报错，但响应状态码不是 200, 解析返回的问题
    if (statusCode !== 200) {
      // console.log('返回错误：' + res.message)
      // 我的后端服务遇到问题一般都抛出了错误，故放在下方 error 回调中处理
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },
  error => {
    console.log('请求/响应失败：' + error) // for debug
    // Message({ message: error.message, type: 'error', duration: 15 * 1000 })
    if (error.response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围
      console.log(error.response.data)
      // console.log(error.response.status)
      // console.log(error.response.headers)
      if ([401, 403].includes(error.response.status)) {
        // token 已过期，删除本地 token
        store.dispatch('user/resetToken')
        Message({ message: '你已经登出了账户, 你可以重新登录，或者关闭这个页面', type: 'warning', duration: 5 * 1000 })
      }
    } else if (error.request) {
      // 请求已发出但未收到响应. `error.request` 是浏览器中 XMLHttpRequest 的一个实例
      console.log(error.request)
    } else {
      // 在设置触发错误的请求时发生了一些事情
      console.log('Error', error.message)
    }
    console.log(error.config)
    return Promise.reject(error)
  }
)

export default service
