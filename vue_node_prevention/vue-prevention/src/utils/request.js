import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance 这个实例是一个方法
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor 添加请求拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // 在请求头中添加token
    if (store.getters.token) {
      // let each request carry token
      // jwt中间件 规定用这样token形式传给后端
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor 添加响应拦截器
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // console.log(response)
    // 响应中的data是从后端获取到的数据对象
    const res = response.data
    // res对象 包含 code msg data
    const errMsg = res.msg || '请求失败'
    // 这里的code 是后端定义的 0是成功 -1 是返回错误的 -2是token失效
    if (res.code !== 0) {
      Message({
        message: errMsg,
        type: 'warning',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(errMsg))
    } else {
      return res
    }
  },
  error => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    console.log('reject', { error }) // for debug
    const { msg, code } = error.response.data
    if (code === -2) {
      // token失效
      MessageBox.confirm('Token 已失效, 是否重新登录', '确认退出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          // 因为路由全局守卫的原因
          // beforeEach 判断没有token 退回到登录界面
          location.reload()
        })
      })
      return Promise.reject(error)
    } else {
      Message({
        message: msg || '请求失败',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
  }
)

export default service
