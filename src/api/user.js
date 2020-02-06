// import request from '../utils/request'
// // export const login = (loginForm) => {
// //   return request('/app/v1_0/authorizations', 'post', loginForm)
// // }

// export function login (data) {
//   return request({
//     url: '/authorizations',
//     data,
//     method: 'post'
//   })
// }

// 用户相关的请求模块
import request from '../utils/request' // 引入封转的模块
export function login (data) {
  return request({
    url: '/authorizations',
    method: 'POST',
    data

  }) //  得到一个promise对象  返回
}

/**
 * 添加关注
 */
export function followings (data) {
  return request({
    url: '/user/followings',
    method: 'post',
    data
  })
}
/**
 * 取消关注
 */

export function unfollowings (data) {
  return request({
    url: `/user/followings/${data}`,
    method: 'delete'

  })
}

/**
 * 获取用户自己的信息  文章 发表状态
 */

export function getUserInfo () {
  return request({
    url: '/user'
  })
}

/**
 * 获取用户的个人资料
 */

export function getUserProfile () {
  return request({
    url: '/user/profile'
  })
}

/**
 * 编辑用户资料
 */

export function updateUserProfile (data) {
  return request({
    url: '/user/profile',
    method: 'patch',
    data
  })
}
