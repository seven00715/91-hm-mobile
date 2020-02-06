<template>
  <div class="comment">
    <!-- 评论列表 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad()">
      <div
        class="item van-hairline--bottom van-hairline--top"
        v-for="comment in comments"
        :key="comment.com_id.toString()"
      >
        <van-image round width="1rem" height="1rem" fit="fill" :src="comment.aut_photo" />
        <div class="info">
          <p>
            <span class="name">{{comment.aut_name }}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{ comment.like_count }}</span>
            </span>
          </p>
          <p>{{ comment.content }}</p>
          <p>
            <span class="time">{{ comment.pubdate | relTime }}</span>&nbsp;
            <van-tag
              plain
              @click="openReply(comment.com_id.toString())"
            >{{ comment.reply_count }} 回复</van-tag>
            <!-- 点击的时候,回去当前评论的ID,才知道获取那条评论的id -->
          </p>
        </div>
      </div>
    </van-list>
    <!-- 底部输入框 -->
    <div class="reply-container van-hairline--top">
      <!--  给v-model一个修饰符trim 去除前后的空格  -->
      <van-field v-model.trim="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button" @click="addComment()">提交</span>
      </van-field>
    </div>
    <!-- 回复列表组件 -->
    <!-- 回复 -->
    <van-action-sheet
      v-model="showReply"
      class="reply_dailog"
      title="回复评论"
      :round="false"
      @close="close()"
    >
      <!-- immediate-check="false" 是否主动加载数据   第一次不会主动调用load方法`-->
      <van-list
        v-model="reply.loading"
        :finished="reply.finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="getReply()"
      >
        <div
          class="item van-hairline--bottom van-hairline--top"
          v-for="reply in reply.list"
          :key="reply.com_id.toString()"
        >
          <van-image round width="1rem" height="1rem" fit="fill" :src="reply.aut_photo" />
          <div class="info">
            <p>
              <span class="name">{{ reply.aut_name }}</span>
            </p>
            <p>{{ reply.content }}</p>
            <p>
              <span class="time">{{ reply.pubdate | relTime}}</span>
            </p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>
</template>

<script>
import { getCommentOrReplys, addCommentOrReply } from '@/api/article' // 引入封装的获取评论方法
export default {
  name: 'comment',
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      // 评论列表的数据
      comments: [],
      // 表示分页依据如果为空,从第一页开始
      offset: null,
      showReply: false, // 控制回复列表组件显示与隐藏
      reply: {
        loading: false,
        finished: false,
        // 回复的偏移量获取评论回复的分页依据
        offset: null,
        // 回复列表   => 当前弹出的关于某条评论回复列表的数据
        list: [],
        // 用来存放当前点击的评论的id
        commentId: null
      }
    }
  },
  // activated () {
  //   // // 情空上一篇评论
  //   // this.comments = []
  //   // // 开启加载中效果
  //   // this.loading = true
  //   // // 重置 是否完全加载完毕 状态
  //   // this.finished = false
  //   // // 重置 偏移量
  //   // this.offset = null
  //   this.onLoad()
  // },
  methods: {
    // 获取评论数据
    async onLoad () {
      await this.$sleep()
      // 获取一级评论数据
      const data = await getCommentOrReplys({
        type: 'a',
        source: this.$route.query.id,
        offset: this.offset
        // offset 分页依据 不可能一口气把所有的评论都加载出来,offset 如果不传或者为null的话,表示查询第一页的数据
        // 第二页数据 需要传入 第一页返回的最后一个id 第三页需要传入第二页的最后一个id
        // 什么时候结束
        // 当前页最后一个id(返回数据中的last_id/下一页请求参数的offset) 和整个评论的最后一个id相等(返回数据中的end_id),表示没有数据了
        // last_id 表示当前页的最后一个id
        // end_id 表示整个评论的最后一个id
        // 如果 last_id === end_id 表示所有的数据请求完毕
        // 分页 => 时间戳
        // 分页 =>偏移量
      })
      // console.log(data)

      this.comments.push(...data.results)
      //  关闭正在上拉加载的状态
      this.loading = false // 关闭正在上拉加载的状态
      // 如果当前页的id等于这个评论的最后一个id ,那么数据请求完毕 => 关闭上拉加载状态finished = false
      this.finished = data.last_id === data.end_id
      this.offset = data.last_id
    },
    // 获取回复
    async openReply (commentId) {
      // 打开回复列表
      this.showReply = true
      // 进行一系列操作
      // 将评论id传到数据里
      this.reply.commentId = commentId

      // 需要重置数据
      this.reply.list = [] // 情况原有的数据
      this.reply.offset = null // 重置回复的偏移量 因为每个评论的回复都是从第一页开始
      this.reply.finished = false // 设置成原始状态
      this.reply.loading = true // 打开加载状态 因为这个时候没有了自动的检查
      // 开始加载第一页的数据
      this.getReply() // 第一次等前面数据清空之后,再手动调用数据
    },
    // 关闭回复
    close () {
      this.reply.commentId = null
      this.$router.go(0)
    },
    // 获取评论的评论(回复/二级评论)
    async getReply () {
      await this.$sleep()
      // 加载逻辑
      const data = await getCommentOrReplys({
        type: 'c',
        source: this.reply.commentId,
        offset: this.reply.offset
      })
      // console.log(data)

      this.reply.list.push(...data.results)
      this.reply.loading = false
      this.reply.finished = data.last_id === data.end_id
      if (!this.reply.finished) {
        this.reply.offset = data.last_id
      }
    },
    // 点击提交
    async addComment () {
      if (!this.value) return false // 当前评论内容为空立刻返回
      // 提交评论的方法
      this.submiting = true // 控制用户单位时间内评论的数据次数
      await this.$sleep()// 强制等待500毫秒
      try {
        // 评论

        // 怎么区分是对文章进行评论还是对评论进行评论
        // 两种方式 通过showReply 判断
        // 用过reply.commentId是否存在

        const data = await addCommentOrReply({
          content: this.value,
          target: this.reply.commentId
            ? this.reply.commentId
            : this.$route.query.id, // 评论的目标的id
          art_id: this.reply.commentId ? this.$route.query.id : null
        })
        console.log(data)

        if (this.reply.commentId) {
          this.reply.list.unshift(data.new_obj)

          // 如果对评论进行回复 应该找到该评论,对该评论+1
          const comment = this.comments.find(item => item.com_id.toString() === this.reply.commmtId)
          // 找到了就是comment 没找到 comment 就是undefined
          comment && comment.reply_count++
        } else {
          this.comments.unshift(data.new_obj)
        }

        this.submiting = false
        this.value = ''
      } catch (error) {
        this.$notify({ type: 'danger', message: '评论失败' })
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name {
        color: #069;
      }
      .zan {
        vertical-align: middle;
        padding-right: 2px;
      }
      .count {
        vertical-align: middle;
        font-size: 10px;
        color: #666;
      }
      .time {
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #696;
  z-index: 9999;

  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
.reply_dailog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content {
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
</style>
