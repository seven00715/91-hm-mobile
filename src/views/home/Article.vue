<template>
  <div class='container' ref="container" @scroll="remember($event)">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" :title=" article.title" ></van-nav-bar>
     <div class="detail">
      <h3 class="title">{{ article.title }}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate|relTime}}</p>
        </div>
        <van-button :loading="fllowingLoading" @click="follow" round size="small" type="info">{{article.is_followed?'已关注':'+ 关注'}}</van-button>
      </div>
      <div class="content" v-html="article.content ">
        <p>内容</p>
      </div>
      <div class="zan">
        <van-button round size="small" :class="{active:article.attitude === 1}" plain icon="like-o" >点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" :class="{active:article.attitude === 0}" plain icon="delete">不喜欢</van-button>
      </div>
      <!-- 放置评论组件 -->
        <comment></comment>
    </div>
  </div>

</template>

<script>
import { getArticle } from '@/api/article'
import { followings, unfollowings } from '@/api/user'
import Comment from './components/comment'
export default {
  name: 'article-index',
  components: {
    Comment
  },
  data () {
    return {
      // 文章详情
      article: {},
      scrollTop: 0,
      fllowingLoading: false
    }
  },
  activated () {
    // 激活组件
    // 新ID地址栏ID String 旧ID article li object|number 进行比较
    if (this.article_id && this.articleId === this.article.art_id.toString()) {
      this.$refs['container'].scrollTop = this.scrollTop
    } else {
      // 不同的文章
      // 清空文章的数据
      this.article = {}
      // 加载数据
      this.getArticle()
    }
  },
  created () {
    this.getArticle()
  },
  computed: {
    articleId () {
      return this.$route.query.id
    }
  },

  methods: {
    // 记住位置
    remember (e) {
      this.scrollTop = e.target.scrollTop
    },
    // 获取详情
    async getArticle () {
      const data = await getArticle(this.articleId)
      this.article = data
    },
    async follow () {
      try {
        this.fllowingLoading = true
        await this.$sleep()
        if (this.article.is_followed) {
        // 取消关注
          await unfollowings(this.article.aut_id)
          // 提示
          this.$notify({ type: 'success', message: '取消关注成功' })
          // this.article.is_followed = false
        } else {
        // 添加关注
          await followings({ target: this.article.aut_id })
          // 提示
          this.$notify({ type: 'success', message: '关注成功' })
          // 更新按钮
          // this.article.is_followed = true
        }
        this.article.is_followed = !this.article.is_followed
        this.fllowingLoading = false
      } catch (error) {
        this.$notify({ type: 'error', message: '操作失败' })
      }
    }

  }
}

</script>

<style scoped lang='less'>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position: sticky;
    top: 46px;
    background-color: #fff;
    z-index: 2;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
  }
}</style>
