<template>
  <div class="container">
    <!-- 当路由地址（path === $route.path）不是`我的`才显示 -->
    <van-nav-bar
      fixed
      title="黑马头条"
      right-text="搜索"
      @click-right="$router.push('/search')"
      v-if="showNavBar"
    />
    <!-- 二级路由容器 -->
    <div class="my-wrapper" :class="{noTop:!showNavBar}">
      <!-- 如果想要缓存二级路由组件的话,可以直接缓存二级路由容器
      如果缓存了这个容器,该容器下的所有组件都会缓存  -->
      <keep-alive>
        <router-view></router-view>
      </keep-alive>

    </div>
    <van-tabbar route>  <!-- 开启路由模式 -->
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/question" icon="chat-o">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item to="/user" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  computed: {
    showNavBar () {
      // this 指向vue实例
      return this.$route.path !== '/user'
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  .my-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop {
      padding-top: 0;
    }
  }
}
</style>
