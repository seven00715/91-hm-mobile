import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '../utils/auth'

Vue.use(Vuex)
// vuex 和缓存数据的同步
export default new Vuex.Store({
  state: {
    // 放置数据 ,直接将用户信息给我们的公共状态
    user: auth.getUser() // 从缓存中读取的的
  },
  // state s数据修改必须通过mutations
  mutations: {
    updated (state, payload) {
      state.user = payload // 更新数据
      auth.setUser(payload) // 将数据同步设置到本地存储中
    },
    // 清空 User
    clearUer (state) {
      state.user = {}
      auth.delUser() // 清空缓存中的数据
    }
  },
  actions: {
  },
  modules: {
  }
})
