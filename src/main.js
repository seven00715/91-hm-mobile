import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible' // 引入自动适配插件 在运行时实时该变font-size大小 根据屏幕大小
import Vant, { Lazyload } from 'vant'// 引入vant组件库 引入lazyload对象(懒加载)
import 'vant/lib/index.less'// 引入样式
import './styles/index.css'
import Router from 'vue-router'
import myPlugin from './utils/plugin'

import VueLazyload from 'vue-lazyload'

const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}
Vue.use(Vant)// 全局注册Vant
Vue.use(myPlugin)
Vue.use(VueLazyload)
Vue.use(Lazyload)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
