<template>
   <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div class="chat-list" ref="list">
      <div class="chat-item" :class="{left:item.name ==='xz',right:item.name !=='xz'}" v-for="(item,i) in list" :key="i">
        <!-- 小智同学 -->
        <van-image v-if="item.name==='xz'" fit="cover" round :src="xzImg" />
        <div class="chat-pao">{{ item.msg }}</div>

        <van-image v-if="item.name!=='xz'" fit="cover" round :src="photo" />

      </div>
      <!-- <div class="chat-item right">
        <div class="chat-pao">ewqewq</div>
        <van-image  fit="cover" round :src="photo" />
      </div> -->
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="说点什么...">
        <!-- 控制发送的评率 -->
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import xzImg from '../../assets/images/logo.png'
import { mapState } from 'vuex'

import io from 'socket.io-client' // 引入 socket.io 的公共变量
export default {
  name: 'user-chat',
  created () {
    // 初始化的钩子函数中 =>建立与websocket 和服务器的连接
    // io('连接地址',{'额外的参数'})
    this.socket = io('http://ttapi.research.itcast.cn', {
      // query 参数
      query: {
        token: this.user.token
      }
    })// 用 this.socket 接受 io(socketIO的实例对象)
    // 建立连接后 =>接受消息
    this.socket.on('connect', () => {
      //
      console.log('和服务器建立连接成功')
      // 先让小智同学和用户说一句话 模拟说话
      this.list.push({ name: 'xz', msg: '你好111111111' })
    })
    // 如何知道建立连接成功
    // 需要监听 小智同学回复的消息 回调参数 中是参数的data => msg(小智同学回复的内容)
    // timestmp 回复是时间
    this.socket.on('message', data => {
      this.list.push({ ...data, name: 'xz' }) // name:'xz' 相当于记录一下,谁发了消息
      this.scrollBottom()
    })
  },
  beforeDestroy () {
    this.socket.close()
  },
  data () {
    return {
      value: '',
      loading: false,
      xzImg, // data中定义一个变量
      photo: JSON.parse(localStorage.getItem('photo')),
      list: [] // 专门存放聊天的内容
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // 滚动到底部
    scrollBottom () {
      // 保证这个方法执行的时候,数据的视图已经更新完毕
      this.$nextTick(() => {
        // 可以保证我们在10条的时候才滚动
        console.log(this.$refs)

        this.$refs.list.scrollTop = this.$refs.list.scrollHeight
      })
    },
    async send () {
      if (!this.value) { return false }
      this.loading = true // 打开加载状态
      // 设置一下时间间隔
      await this.$sleep(1000)
      this.socket.emit('message', { msg: this.value, timestamp: Date.now() })
      this.list.push({ name: 'self', msg: this.value })
      this.value = ''
      this.scrollBottom()
      this.loading = false
    }
  }
}

</script>

<style scoped lang='less'>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
