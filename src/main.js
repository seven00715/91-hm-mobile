import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible' // 引入自动适配插件 在运行时实时该变font-size大小 根据屏幕大小
import Vant from 'vant'// 引入vant组件库
import 'vant/lib/index.css'// 引入样式
import './styles/index.css'
Vue.use(Vant)// 全局注册Vant

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
