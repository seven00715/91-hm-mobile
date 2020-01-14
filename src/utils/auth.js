// 该文件专门处理  用户信息的存储和删除 以及获取
// 放在localStorage

const USER_TOKEN = 'hm-toutiao-m-91-token' // 用来存储数据

// 直接导出一个方法,(用的时候)可以按需导入
// 设置用户token信息
export function setUser (user) {
  localStorage.setItem(USER_TOKEN, JSON.stringify(user))
}

// 读取用户信息
export function getUser () {
  return JSON.parse(localStorage.getItem(USER_TOKEN) || '{}') // 短路表达式
}

// 删除用户信息

export function delUser () {
  localStorage.removeItem(USER_TOKEN)
}
