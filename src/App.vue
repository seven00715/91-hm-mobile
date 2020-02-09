<template>
  <div id="app">
    <!-- 一级路由组件 -->
    <!-- 在路由表里添加mete属性 -->
    <!-- 如果为true包在里面,如果为false 放在外面 -->
    <!-- 可以保证只有layout组件缓存 -->
    <keep-alive>
      <router-view v-if="$route.meta.isAlive" />
    </keep-alive>
      <router-view v-if="!$route.meta.isAlive" />
  </div>
</template>

<style lang="less">
</style>
