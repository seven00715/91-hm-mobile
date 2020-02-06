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

/**
 * 获取联想建议词条
 */
export function suggestion (params) {
  return request({
    url: '/suggestion',
    params
  })
}
/**
 * 获取搜索结果
 */
export function search (params) {
  return request({
    url: '/search',
    params
  })
}

/**
 * 获取文章详情
 * /articles/:article_id
 */

export function getArticle (params) {
  return request({
    url: `/articles/${params}`
  })
}

/**
 * 不喜欢
 */

export function disLikes (data) {
  return request({
    url: '/article/dislikes',
    method: 'post',
    data
  })
}

/**
 * 取消不喜欢
 */

export function undisLikes (data) {
  return request({
    url: `/article/dislikes/${data}`,
    method: 'post'
  })
}

/**
 * 点赞
 */

export function likings (data) {
  return request({
    url: '/article/likings',
    method: 'post',
    data
  })
}
/**
 * 取消点赞
 */

export function unlikings (data) {
  return request({
    url: `/article/likings/${data}`,
    method: 'delete'
  })
}

/**
 * 获取评论或者回复
 */

export function getCommentOrReplys ({ type, source, offset, limit = 10 }) {
  return request({
    url: '/comments',
    params: { type, source, offset, limit }
  })
}
/**
 *添加评论或者评论的回复
 */
export function addCommentOrReply (data) {
  return request({
    url: '/comments',
    method: 'post',
    data: { ...data }
  })
}
