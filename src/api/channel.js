import request from '../utils/request'

import store from '@/store'

/**
 *  获取全部频道
 */

export function getAllChannels () {
  return request({
    url: '/channels'
  })
}

/**
 * 获取我的频道
 */
// export function getMychannels () {
//   return request({
//     url: '/user/channels'
//     // method: 'get'   axios 默认是get 类型

//   })
// }
// --------------------------------------------------------
const CACHE_CHANNEL_T = 'hm-toutiao-91-t'
const CACHE_CHANNEL_U = 'hm-toutiao-91-U'
/**
 * 获取我的频道
 * 三种情况
 * 1. 已经登录 获取我的频道返回数据即可
 * 2. 未登录:本地没有缓存频道数据,获取默认的频道频道,本地储存起来,返回默认数据
 * 3. 未登录:本地已经缓存频道数据,返回本地数据即可
 * 是返回一个Promise对象,来返回数据的
 */

export const getMychannels = () => {
  return new Promise(async (resolve, reject) => {
    let key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANNEL_T
    let str = localStorage.getItem(key)

    if (str) {
      // 如果有本地数据
      resolve({ channels: JSON.parse(str) }) // 从缓存中得到的数据,下发到下一个Promise
    } else {
      // 如果没有数据
      const data = await request({ url: '/user/channels' })
      localStorage.setItem(key, JSON.stringify(data.channels)) // 重新将线上数据写入缓存
      resolve(data) // 将线上获取的数据 放给下个请求
    }
    // const { user } = store.state
    //   if (user.token) {
    //     // 情况一
    //     const data = await request({
    //       url: '/user/channels'
    //     })
    //     resolve(data)
    //   } else {
    //     const localChannels = JSON.parse(window.localStorage.getItem(KEY) || '[]')
    //     if (!localChannels.length) {
    //       // 情况2
    //       const data = await request({
    //         url: '/user/channels'
    //       })
    //       window.localStorage.setItem(KEY, JSON.stringify(data.channels))
    //       resolve(data)
    //     } else {
    //       // 情况3
    //       resolve({ channels: localChannels })
    //     }
    //   }
  })
}

/**
 * 删除我的频道
 */
// export const delChannel = (channelId) => {
//   return new Promise(async (resolve, reject) => {
//     const { user } = store.state
//     if (user.token) {
//       // 用户登录了
//       await request({
//         url: `/user/channels/${channelId}`,
//         method: 'delete'

//       })
//       resolve()
//     } else {
//       // 从本地储存取出
//       //
//       const localChannels = JSON.parse(window.localStorage.getItem(KEY) || '[]')
//       // 删除频道
//       localChannels.splice(localChannels.findIndex(item => (item.id === channelId), 1))

//       window.localStorage.setItem(KEY, JSON.stringify(localChannels))
//       resolve()
//     }
//   })
// }

// 删除频道
export function delChannel (id) {
  return new Promise(function (resolve, reject) {
    // 首先也需要做判断是 删除游客 还是用户的频道
    let key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANNEL_T
    let channels = JSON.parse(localStorage.getItem(key)) // 缓存结果,缓存中一定是有数据的
    let index = channels.findIndex(item => item.id === id)
    if (index > -1) {
      // s删除数据
      channels.splice(index, 1) // 直接删除原数组中的数据
      // channels = channels.filter(item => item.id !== id)  // 过滤数组中所有不等id的值,组成新数组
      localStorage.setItem(key, JSON.stringify(channels)) // 重新写入缓存
      resolve()
    } else {
      reject(new Error('找不到对应频道'))
    }
  })
}

// 添加频道

export function addChannel (channel) {
  return new Promise(function (resolve) {
    let key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANNEL_T
    let cacheChannels = localStorage.getItem(key) // 获取缓存
    if (cacheChannels) {
      let channels = JSON.parse(cacheChannels)
      channels.push(channel) // 添加
      localStorage.setItem(key, JSON.stringify(channels))
      resolve() // 成功执行
    }
  })
}
