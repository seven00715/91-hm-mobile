module.exports = { // node.js 代码 只在编译时候起作用,不会再运行时候器作用
  plugins: {
    'autoprefixer': {},
    'postcss-pxtorem': {
      rootValue: 37.5, // 手机以iPhone6为主要配置  375十分之一
      propList: ['*']
    }
  }
}
