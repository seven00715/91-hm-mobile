<template>
  <div class="container">
    <van-tabs v-model="activeIndex" swipeable>
      <van-tab v-for="channel in channels" :title="channel.name" :key="channel.id">
        <!-- 列表内容 -->
        <!-- <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="refreshSuccessText">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <van-cell v-for="item in articleList" :key="item">{{ item }}</van-cell>
        </van-list>
        </van-pull-refresh>-->
        <!--  如果要监听子组件的事件,就应该在子组件的标签上写监听 -->
        <article-list :channel_id='channel.id' @showAction="openMoreAction"></article-list>
      </van-tab>
    </van-tabs>
    <span class="bar_btn" slot="nav-rigth">
      <van-icon name="wap-nav" />
    </span>
    <!-- 放置弹层 -->
    <van-popup v-model="showMoreActions">
        <more-action @dislike='dislike'></more-action>
    </van-popup>
  </div>
</template>

<script>
import { getMychannels } from '@/api/channels'
// import { getArticles } from '@/api/article'
import ArticleList from './components/article-list'

import MoreAction from './components/more-action'
import { dislikeArticle } from '../../api/article'
import evenBus from '../../utils/eventBus'
export default {
  name: 'home-index', // devtools 查看组件的时候,就是这个name
  components: {
    ArticleList, MoreAction
  },
  data () {
    return {
      activeIndex: 0,
      channels: [],
      showMoreActions: false,
      articleId: null
    }
  },
  computed: {
    activeChannel () {
      return this.channels[this.activeIndex]
    }
  },
  created () {
    this.getMychannel()
  },
  methods: {

    // 监听子组件是事件
    openMoreAction (artId) {
      this.showMoreActions = true
      this.articleId = artId
    },
    // 调用不喜欢接口
    async dislike () {
      try {
        await dislikeArticle({ target: this.articleId })
        // await dislikeArticle({ target: this.artId })
        this.$notify({ type: 'success', message: '操作成功' })

        evenBus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
        this.showMoreActions = false
      } catch (error) {
        console.log(error)

        this.$notify({
          type: 'danger',
          message: '操作失败'
        })
      }
    },
    async getMychannel () {
      let res = await getMychannels()
      // console.log(res)

      this.channels = res.channels.map(item => ({
        id: item.id,
        name: item.name,
        loading: false,
        finished: false,
        articles: [],
        downLoading: false,
        timestamp: Date.now() // 默认给最新的时间
      }))
    }
  }
}
</script>

<style scoped lang='less'>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
.van-popup {
  width: 80%;
  border-radius: 4px;
}
</style>
