
import axios from 'axios'

import JSONBIGINT from 'json-bigint'

import store from '../store'

import router from '@/router'

const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',

  // 转换原始数据格式
  transformResponse: [function (data) {
    // Do whatever you want to transform the data
    try {
      return JSONBIGINT.parse(data)
    } catch (e) {
      return data
    }
  }]
})

// 请求拦截器
// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  if (store.state.user.token) {
    config.header.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截器
// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  // 处理响应
  try {
    return response.data.data
  } catch (e) {
    return response
  }
}, async error => { //  响应失败 处理失效 的token
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  try {
    if (error.response && error.response.status === 401) {
      const { user } = store.state
      // 如果没有token没登录 如果没有refresh_token 无法刷新token

      if (!user.token || !user.refresh_token) {
        router.push('/login')
        return Promise.reject(error)
      }
      // 刷新 token 发送请求 没有配置axios 自己配置refresh_token
      const res = await axios({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        methods: 'put',
        header: {
          'Authorization': `Bearer ${user.refresh_token}`
        }

      })
      // token 获取 res.data.data.token
      // 更新vuex 和本地 token
      store.commit('updated', {
        token: res.data.data.token,
        refresh_token: res.data.data.refresh_token
      })
      return instance(error.config)
    }
  } catch (e) { // exception 异常???
    // 刷新 token失败
    router.push('/login')
    return Promise.reject(e)
  }
  return Promise.reject(error)
})

export default (url, method, data) => {
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data

  })
}
