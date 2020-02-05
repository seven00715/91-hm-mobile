// 为什么要封装request
// 要在拦截器里处理 token统一,响应数据的统一处理 返回大数字
// token失效

import axios from 'axios'

import JSONBIGINT from 'json-bigint'

import store from '../store'

import router from '@/router'

const instance = axios.create({ //  创建一个新的axios 实例
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0',

  // 转换原始数据格式
  transformResponse: [function (data) {
    // Do whatever you want to transform the data5
    try {
      return JSONBIGINT.parse(data) // 替换原来的JSON.parse
    } catch (e) {
      return data
    }
  }]
})

// 请求拦截器
// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  // 应该在返回配置前在请求头里塞入token
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, function (error) {
  // Do something with request error
  console.log(error)

  return Promise.reject(error) // 直接返回错误
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
    return response.data
  }
}, async error => { //  响应失败 处理失效 的token
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  // try {
  //   if (error.response && error.response.status === 401) {
  //     const { user } = store.state
  //     // 如果没有token没登录 如果没有refresh_token 无法刷新token

  //     if (!user.token || !user.refresh_token) {
  //       router.push('/login')
  //       return Promise.reject(error)
  //     } else {
  //       let toPath = router.push({ path: '/login', query: { redirectUrl: router.currentRoute.path } })
  //       router.push(toPath)
  //     }
  //     // 刷新 token 发送请求 没有配置axios 自己配置refresh_token
  //     const res = await axios({
  //       url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
  //       methods: 'put',
  //       header: {
  //         'Authorization': `Bearer ${user.refresh_token}`
  //       }

  //     })
  //     // token 获取 res.data.data.token
  //     // 更新vuex 和本地 token
  //     store.commit('updated', {
  //       token: res.data.data.token,
  //       refresh_token: res.data.data.refresh_token
  //     })
  //     return instance(error.config)
  //   }
  // } catch (e) { // exception 异常???
  //   // 刷新 token失败
  //   router.push('/login')
  //   return Promise.reject(e)
  // }
  // -------------------方法二--------------------------------
  // 接口文档显示    401 用户未认证 此时是没有token或者是token失效
  if (error.response && error.response.status === 401) {
    // 保存本来要跳转的页面,方便登录后使用
    let toPath = { path: '/login', query: { redirectUrl: router.currentRoute.path } }
    // 开始补救措施,查看本地是否有refresh_token
    if (store.state.user.refresh_token) {
      // 使用try{}catch捕获错误
      try {
        // 有的话发送请求刷新token
        // 这里不应该再用instance  因为 instance会再次进入拦截器  用默认的axios
        let res = await axios({
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          method: 'put',
          headers: {
            Authorization: `Bearer ${store.state.user.refresh_token}`
          }
        })
        // 更新vuex 的数据,同时也更新了本地缓存数据
        store.commit('updated', {
          user: {
            token: res.data.data.token,
            refresh_token: store.state.user.refresh_token // 将之前的refresh_token有效期14天
          }
        })
        // 把刚才错误的请求发出去  result就是结果
        return instance(error.config)
      } catch (error) {
        // 表示补救措施无效(refresh_token过期或无效),应该跳转到登录页面  并且情空 无效的user
        store.commit('clearUser')
        router.push(toPath)
        return Promise.reject(error)
      }
    } else {
      // 连refresh_token 都没有
      //  当访问 页面时 => 去登录 => 登录成功之后 => 回到之前的页面
      // 要记住当前的地址 => 在登录页面 => 读取地址  => 根据读取的地址跳转
      router.push(toPath)
      return Promise.reject(error)
    }
  }
  return Promise.reject(error)
})

// export default (url, method, data) => {
//   return instance({
//     url,
//     method,
//     [method.toLowerCase() === 'get' ? 'params' : 'data']: data

//   })
// }
export default instance

// 两个问题 为什么这里刷新token接口里写了必须要id值,这里不写没关系
// return instance(error.config)  重新发了一遍刚才错误的请求,那么取得的结果应该是 response吧
