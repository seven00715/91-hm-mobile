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
    <span class="bar_btn" slot="nav-rigth" @click="showEditChannel=true">
      <van-icon name="wap-nav" />
    </span>
    <channel-edit
    v-model="showEditChannel"
    :channels="channels"
    :activeIndex="activeIndex"

    @selectChannel = 'selectChannel'
    @delChannel = 'delChannel'
    @addChannel = 'addChannel'
    >
    <!--   @update='activeIndex=$event' -->
    </channel-edit>
    <!-- 放置弹层 -->
    <van-popup v-model="showMoreActions">
      <!--  report事件中的第一个参数$event 实际上就是moreAction组件传出的参数 -->
      <!-- 在原生事件中，$event是事件对象 在自定义事件中，$event是传递过来的数据 -->
        <more-action
        @dislike="dislikeOrReport($event,'dislike')"
        @report ="dislikeOrReport($event,'report')"
         ></more-action>
    </van-popup>
  </div>
</template>

<script>
import { getMychannels, delChannel, addChannel } from '@/api/channel'
// import { getArticles } from '@/api/article'
import ArticleList from './components/article-list'

import MoreAction from './components/more-action'
import { dislikeArticle, reportsArticle } from '@/api/article'
import evenBus from '@/utils/eventBus'

import ChannelEdit from './components/channel-edit'
export default {
  name: 'home-index', // devtools 查看组件的时候,就是这个name
  components: {
    ArticleList, MoreAction, ChannelEdit
  },
  data () {
    return {
      activeIndex: 0,
      channels: [],
      showMoreActions: false,
      articleId: null,
      showEditChannel: false
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
    // 添加频道
    async addChannel (channel) {
      await addChannel(channel)
      this.channels.push(channel)// 自身加一个频道 影响子组件
    },
    // 删除频道
    async delChannel (id) {
      try {
        await delChannel(id)
        // 移除自身 data => channels中的数据
        let index = this.channels.findIndex(item => item.id === id)
        if (index <= this.activeIndex) {
          // 如果删除的频道在当前激活频道之前或者就是当前激活频道
          // 要把我们激活索引往前挪一位
          this.activeIndex--
        }
        if (index > -1) {
          this.channels.splice(index, 1)
          // 激活组件的切换
        }
      } catch (error) {
        this.$notify({ type: 'danger', message: '删除频道失败' })
      }
    },

    selectChannel (id) {
      let index = this.channels.findIndex(item => item.id === id)
      this.activeIndex = index
      this.showEditChannel = false
    },
    // 监听子组件是事件
    openMoreAction (artId) {
      this.showMoreActions = true
      this.articleId = artId
    },
    // 调用不喜欢接口和举报接口
    async dislikeOrReport (params, operatetype) {
      try {
        if (this.articleId) {
          operatetype === 'dislike'
            ? await dislikeArticle({ target: this.articleId })
            : await reportsArticle({ target: this.articleId, type: params })
          this.$notify({ type: 'success', message: '操作成功' })
          evenBus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
          this.showMoreActions = false
        }

        // await dislikeArticle({ target: this.artId })
      } catch (error) {
        this.$notify({
          type: 'danger',
          message: '操作失败'
        })
      }
    },
    async report (reportType) {
      try {
        await reportsArticle({ target: this.articleId, type: reportType })
        this.$notify({ type: 'success', message: '操作成功' })
        this.showMoreActions = false
      } catch (error) {
        console.log(error)

        this.$notify({
          type: 'danger',
          message: '操作失败'
        })
      }
    },
    // 获取频道列表接口
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
