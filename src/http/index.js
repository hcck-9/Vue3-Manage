import axios from 'axios'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from '@/router'

import newMessage from '@/utils/message.js'

const instance = axios.create({
  // back URL地址
  baseURL: 'http://127.0.0.1:3007',
  timeout: 6000,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    NProgress.start() //开启进度条
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
// 在合适的作用域中定义一个标志位
let isTokenExpiredAlertShown = false
instance.interceptors.response.use(
  function (response) {
    NProgress.done() //响应完成后关闭
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    // if (response.data.status || response.data.message) {
    //   ElMessage({
    //     message: response.data.message,
    //     type: 'success'
    //   })
    // } else {
    //   ElMessage.error(response.data.message)
    // }
    if (response.data.status === 1) {
      const typeAndMsg = response.data.message.split(':')
      const type = typeAndMsg[0]
      const msg = typeAndMsg[1]
      if (type === 'Token Error') {
        router.push('/')
        newMessage.info('登录状态失效，请重新登录!')
        // 返回包含错误信息的 Promise，不抛出错误到浏览器
        return Promise.resolve(msg)
      }
    }
    return response
  },
  function (error) {
    NProgress.done() //响应完成后关闭
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export default instance
