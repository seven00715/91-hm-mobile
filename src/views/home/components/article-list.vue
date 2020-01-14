<template>

     <div class="scroll-wrapper">
          <van-cell-group>
            <van-pull-refresh
              v-model="downLoading"
              @refresh="onRefresh"
              :success-text="refreshSuccessText"
            >
              <van-list
                v-model="upLoading"
                @load="onLoad"
                :finished="finished"
                finished-text="没有更多了"
              >
                <van-cell v-for="item in articles" :key="item.art_id.toString()">
                   <div class="article_item">
                    <h3 class="van-ellipsis">{{ item.title }}</h3>
                    <div class="img_box" v-if="item.cover.type === 3">
                      <van-image lazy-load class="w33" fit='cover' :src="item.cover.images[0]"></van-image>
                      <van-image lazy-load class="w33" fit='cover' :src='item.cover.images[1]'></van-image>
                      <van-image lazy-load class="w33" fit='cover' :src='item.cover.images[2]'></van-image>
                    </div>
                     <div class="img_box" v-if="item.cover.type === 1">
                      <van-image class="w33" lazy-load fit='cover' :src="item.cover.images[0]">
                      </van-image>
                    </div>
                    <div class="info_box">
                      <span>{{ item.aut_name }}</span>
                      <span>{{ item.comm_count }}</span>
                      <span>{{ item.pubdate|relTime }}</span>
                      <!-- 点击叉号  告诉父组件 我要反馈 -->
                      <span class="close" v-if="user.token" @click="$emit('showAction',item.art_id.toString())">
                        <van-icon name='cross'></van-icon>
                        </span>
                    </div>
                  </div>
                </van-cell>
              </van-list>
            </van-pull-refresh>
          </van-cell-group>
        </div>
</template>

<script>
// import { getMychannels } from '@/api/channels'
import { getArticles } from '../../../api/article'
import { mapState } from 'vuex'
import eventBus from '../../../utils/eventBus'
export default {
  name: 'article-list', // devtools 查看组件的时候,就是这个name
  props: {
    channel_id: {
      type: Number,
      required: true,
      default: null
    }
  },
  // 映射vuex中的对象到组件中
  computed: {
    ...mapState(['user'])
  },
  data () {
    return {
      activeIndex: 0,
      upLoading: false,
      finished: false,
      articles: [],
      downLoading: false,
      refreshSuccessText: '',
      channels: [],
      timestamp: '' // 定义一个时间戳，告诉服务器，现在我要求什么样的时间的数据
    }
  },
  created () {
    // 开启监听
    eventBus.$on('delArticle', (articleId, channelId) => {
      if (this.channel_id === channelId) {
        let index = this.articles.findIndex(item => item.art_id.toString() === articleId)
        // 查找文章  //如果返回大于 -1表示找到了,就要删除
        if (index > -1) {
          this.articles.splice(index, 1)
        }
      }
    })
  },
  methods: {
    // 上拉加载
    async onLoad () {
      // ----------模拟数据--------------
      // 异步更新数据
      // window.setTimeout(() => {
      //   const data = []
      //   for (
      //     let i = this.articleList.length;
      //     i < this.articleList.length + 10;
      //     i++
      //   ) {
      //     data.push(i + 1)
      //   }
      //   this.articleList.push(...data)
      //   // 加载状态结束
      //   this.upLoading = false

      //   if (this.articleList.length >= 40) {
      //     this.finished = true
      //   }
      // }, 1500)
      // -------------------------------
      await this.$sleep(1000)
      let data = await getArticles({ timestamp: this.timestamp || Date.now(), channel_id: this.channel_id })
      console.log(data)

      this.articles.push(...data.results) // 将数据加入到文章列表之中
      this.upLoading = false // 结束下拉
      // 判断历史时间戳 如果有历史记录。表示可以加载 （下一次用历史时间戳加载）。没有历史就不往下看了下拉刷新关闭
      if (!data.pre_timestamp) {
        this.finished = true
      } else {
        this.timestamp = data.pre_timestamp
      }
    },

    // 下拉刷新
    async onRefresh () {
      // // --------------------模拟获取数据 --------
      // window.setTimeout(() => {
      //   // 获取数据成功
      //   const data = []
      //   // 结束刷新效果
      //   this.downLoading = false
      //   if (data.length) {
      //     // 替换数据
      //     this.articleList = data
      //     // 提示文案
      //     this.finished = false
      //     this.refreshSuccessText = '更新成功'
      //     // 防止不足一屏数据
      //     this.onLoad()
      //     // 重置是否加载完毕
      //     this.finished = false
      //   } else {
      //     // 提示文案
      //     this.refreshSuccessText = '暂无更新'
      //   }
      // }, 1500)

      // ----------------------------
      // this.timestamp = Date.now() // 最新数据要用最新的时间戳
      await this.$sleep(1000)
      this.downLoading = false // 关掉下拉状态
      let data = await getArticles({ channel_id: this.channel_id, timestamp: Date.now() })
      if (data.results.length) {
        this.articles = data.results
        this.finished = false
        // this.refreshSuccessText = '更新成功'
        this.timestamp = data.per_timestamp // 赋值历史时间戳，当上拉加载的时候要用到历史时间戳
        this.refreshSuccessText = `更新了${data.results.length}条数据`
      } else {
        // 如果没有数据 表示没更新
        this.refreshSuccessText = '已是最新数据'
      }
    }
    // async getMychannel () {
    //   let res = await getMychannels()
    //   // console.log(res)

    //   this.channels = res.channels.map(item => ({
    //     id: item.id,
    //     name: item.name,
    //     loading: false,
    //     finished: false,
    //     articles: [],
    //     downLoading: false,
    //     timestamp: Date.now() // 默认给最新的时间

    //   }))
    // }
  }
}
</script>

<style lang="less" scoped>
.article_item{
  h3{
    font-weight: normal;
    line-height: 2;
  }
  .img_box{
    display: flex;
    justify-content: space-between;
    .w33{
      width: 33%;
      height: 90px;
    }
    .w100{
      width: 100%;
      height: 180px;
    }
  }
  .info_box{
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span{
      padding-right: 10px;
      &.close{
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}

</style>
