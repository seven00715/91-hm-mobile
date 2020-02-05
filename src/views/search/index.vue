<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <!-- trim自动去空格的修饰符 -->
    <van-nav-bar  left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <!-- 搜索框 -->
    <van-search v-model.trim="q" @search ='OnSearch' placeholder="请输入搜索关键词" shape="round" />
    <!-- 联想搜索 -->
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell icon="search" v-for="item in suggestList" :key="item" @click='searchResult(item)'>
        <span>{{ item }}</span>
      </van-cell>
    </van-cell-group>
    <!--  历史记录 -->
    <div class="history-box" v-else-if="historyList.length">
      <div class="head">
        <span>历史记录</span>
        <!-- 情空所有历史 -->
        <van-icon name="delete" @click="clear"></van-icon>
      </div>
      <van-cell-group>
        <!-- 循环生成历史记录 item是唯一的. -->
        <van-cell @click="toResult(item)" v-for="(item ,index) in historyList" :key="item">
          <a class="word_btn">{{ item }}</a>
          <!-- 给删除按钮注册删除事件 -->
          <!-- 事件修饰符,表示阻止了事件冒泡 -->
          <van-icon @click.stop="delHistory(index)" class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { suggestion } from '../../api/article'
const key = 'hm-91-toutiao-history'
export default {
  name: 'search',
  data () {
    return {
      q: '',
      historyList: [],
      suggestList: []
    }
  },
  watch: {
    // 防抖搜索
    // q () {
    //   clearTimeout(this.timer)
    //   this.timer = setTimeout(async () => {
    //     if (!this.q) {
    //       this.suggestList = []
    //       return false
    //     }
    //     let data = await suggestion({ q: this.q })
    //     this.suggestList = data.options
    //   }, 300)
    // },
    // 节流搜索
    q () {
      if (!this.timer) {
        this.timer = setTimeout(async () => {
          this.timer = null
          if (!this.q) {
            this.suggestList = []
            return false
          }
          let data = await suggestion({ q: this.q })
          this.suggestList = data.options
        }, 1000)
      }
    }
  },
  created () {
    this.historyList = JSON.parse(localStorage.getItem(key) || '[]')
  },
  methods: {
    delHistory (index) {
      this.historyList.splice(index, 1)// 删除对应的历史记录
      localStorage.setItem(key, JSON.stringify(this.historyList))
    },
    toResult (text) {
      this.$router.push({ path: '/search/result', query: { q: text } })
    },
    clear () {
      this.historyList = []
      localStorage.setItem(key, '[]')
    },
    OnSearch () {
    // 跳转到搜索结果之前应该吧当前的搜索关键字 写入到历史记录
      if (!this.q) return
      let obj = new Set(this.historyList) // 生成一个set 对象
      // 搜索关键词加到历史记录
      obj.add(this.q)
      this.historyList = Array.from(obj) // 将set转回数组
      localStorage.setItem(key, JSON.stringify(this.historyList))
      // 区搜索结果页面 而且也要携带参数 q(搜索词)
      this.$router.push({ path: '/search/result', query: { q: this.q } })
    },
    searchResult (text) {
      let obj = new Set(this.historyList)
      obj.add(text)
      this.historyList = Array.from(obj)
      localStorage.setItem(key, JSON.stringify(this.historyList))
      this.$router.push({ path: '/search/result', query: { q: this.q } })
    }
  }

}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
