import request from '@/utils/request'

/**
 * 获取我的频道
 */
export function getMychannels () {
  return request({
    url: '/user/channels'
    // method: 'get'   axios 默认是get 类型

  })
}
