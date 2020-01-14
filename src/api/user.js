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
