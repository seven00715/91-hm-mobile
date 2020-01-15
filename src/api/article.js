import request from '../utils/request'

/**
 *  axios中 query 参数放在params上
 * data参数 放在 data上
 */
export function getArticles (params) {
  return request({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',

    // method: 'get',
    params: { ...params, with_top: 1 }

  })
}
/**
 * 不喜欢文章接口
 */
export function dislikeArticle (data) {
  return request({
    url: '/article/dislikes',
    data,
    method: 'post'

  })
}

/**
 * 举报文章
 *  /article/reports
 */

export function reportsArticle (data) {
  return request({
    url: '/article/reports',
    data,
    method: 'post'
  })
}
