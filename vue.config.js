module.exports = {
  lintOnSave: false,
  // 覆盖蓝色主题
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          blue: '#3296fa'
        }
      }
    }
  },
  configureWebpack: (config) => {
    // 这个config参数就是当前vue-cil项目里的所有的webpack配置信息
    // 想要改动 直接改这个信息就可以

    // 先判断下当下的环境是否是生产环境
    if (process.env.NODE_ENV === 'production') {
      // webpack在生产环境下运行
      // 把所有的console 都删除 然后再打包
      // 这里是删除不是删除源代码 ,而是删除打包出来的 console
      // .drop_console = true 的意思是删除所有的 console
      //
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  publicPath: './'
}
