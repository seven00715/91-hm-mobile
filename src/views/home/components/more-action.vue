<template>
  <!-- <van-popup :value="value" @input="$emit('input',$event)" @open="isReport=false"> -->
    <van-cell-group v-if="!isReport">
      <!-- 触发父组件调用不管=感兴趣接口 -->
      <van-cell @click="$emit('dislike')">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <!-- 点击举报按钮 触发父组件 去调用举报文章的接口 -->
      <van-cell v-for="item in reports" :key="item.value" @click="$emit('report',item.value)">{{ item.label }}</van-cell>
      <!-- <van-cell>色情</van-cell>
      <van-cell>暴力</van-cell>
      <van-cell>低俗</van-cell>
      <van-cell>不适</van-cell>
      <van-cell>错误</van-cell>
      <van-cell>其他</van-cell> -->
    </van-cell-group>
  <!-- </van-popup> -->
</template>

<script>
import { reports } from '@/api/constants'
import eventBus from '@/utils/eventBus'

export default {
  name: 'more-action',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    articleId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      isReport: false,
      reports
    }
  },
  created () {
    eventBus.$on('delArticle', () => {
      this.isReport = false
    })
  },
  methods: {

  }
}
</script>

<style scoped lang='less'>
.van-popup {
  width: 80%;
  border-radius: 4px;
}
</style>
