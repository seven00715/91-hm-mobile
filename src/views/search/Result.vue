
<template>
  <div class="container">
     <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()" />

      <van-list v-model="uploading" :finished='finished' @load="onLoad"  finished-text="没有更多了" >
        <van-cell-group >
          <van-cell v-for="article in articles" :key="article.art_id" @click="$router.push(`/article?id=${article.art_id.toString()}`)">
            <div class="article_item">
              <h3 class="van-ellipsis">{{ article.title }}</h3>
              <div class="img_box" v-if="article.cover.type === 3">
                <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[1]" />
                <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[2]" />
              </div>
              <div class="img_box" v-if="article.cover.type === 3">
                <!-- lazy-load 当图片显示在可视区域的时候才去请求图片 -->
                <van-image lazy-load class="w100" fit="cover" :src="article.cover.images[0]" />
              </div>
              <div class="info_box">
                <span>{{ article.aut_name }}</span>
                <span>{{ article.comm_count }}评论</span>
                <span>{{ article.pubdate| relTime }}</span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
  </div>
</template>

<script>
import { search } from '@/api/article'
export default {
  data () {
    return {
      uploading: false,
      finished: false,
      articles: [],
      reqParams: {
        page: 1,
        q: this.$route.query.q
      }

    }
  },
  methods: {
    async onLoad () {
      let data = await search(this.reqParams)
      // 上拉加载的业务 都是追加到队尾
      this.articles.push(...data.results)
      // 去掉加载效果
      this.uploading = false
      // 如果当前的长度为0 ,那下一页肯定没有数据了
      // 不为0有数据
      if (data.results.length) {
        this.reqParams.page++
      } else {
        this.finished = true
      }
    }
  }

}
</script>

<style lang="less" scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
