import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn' // 引入语言包
dayjs.extend(relativeTime) // 加入相对时间
/**
 * value(要处理的 前面的值 |(过滤器名称)) 在这里就是时间
 */
const relTime = (value) => {
  return dayjs().locale('zh-cn').from(value) // 应用语言包和转换格式
}
// function（time = 500） 如果穿time用传的 如果不传用 500
const sleep = (time = 500) => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, time) // 表示等待time时间之后才能resolve
  })
}

export default {
  install (Vue) {
    Vue.prototype.$sleep = sleep // 封装一个休眠函数
    Vue.filter('relTime', relTime)
  }
}
