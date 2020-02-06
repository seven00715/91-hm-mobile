import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '../store'
const Layout = () => import('../views/Layout')// 布局组件
const Home = () => import('../views/home/index.vue') // 主页组件
const Qusetion = () => import('../views/question/index.vue') // 问答组件
const Video = () => import('../views/video/index.vue')// 视频
const User = () => import('../views/user/index.vue') // 用户
const UserProfile = () => import('../views/user/Profile.vue') // 资料编辑
const UserChat = () => import('../views/user/Chat.vue') // 小智
const Login = () => import('../views/user/Login.vue') // 登录
const Search = () => import('../views/search/index.vue') // 搜索
const SearchResult = () => import('../views/search/Result.vue') // 搜索结果
const Article = () => import('../views/home/Article.vue') // 文章详情
Vue.use(VueRouter)

const routes = [{
  path: '/',
  component: Layout,
  children: [
    { path: '/', name: 'home', component: Home }, // 二级路由
    { path: '/question', name: 'question', component: Qusetion },
    { path: '/video', name: 'video', component: Video },
    { path: '/user', name: 'user', component: User }
  ]
},
{ path: '/user/profile', name: 'user-profile', component: UserProfile },
{ path: '/user/chat', name: 'user-chat', component: UserChat },
{ path: '/login', name: 'login', component: Login },
{ path: '/search', name: 'search', component: Search },
{ path: '/search/result', name: 'search-result', component: SearchResult },
{ path: '/article', name: 'article', component: Article }

]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // const { user } = store.state
  const toPath = {
    path: '/login',
    query: {
      redirectUrl: to.fullPath // 携带刚才要去的地址到登录页=>登录成功之后 ,有可权限再到刚才没有权限去的地址
      // path 换成 fullpath 防止参数丢失
    }
  }
  // console.log(store.state.user.token)

  if (to.path.startsWith('/user') && !store.state.user.token) {
    return next(toPath)
  }
  next() // 直接放行
})

export default router
