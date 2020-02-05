<template>
  <div class="container">
    <van-action-sheet
      :value="value"
      @closed="editing=false"
      @input="$emit('input',$event)"
      title="编辑频道"
    >
      <div class="channel">
        <div class="tit">
          我的频道:
          <span class="tip">点击可进入频道</span>
          <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
          <van-button v-else @click="editing = false" size="mini" type="warning" plain class="red">完成</van-button>
          <van-grid class="van-hairline--left">
            <van-grid-item v-for="(item,i) in channels" :key="item.id">
              <!-- @click="enterChannel(i)" -->
              <span class="f12" :class="{ red: i===activeIndex}" @click="$emit('selectChannel',item.id)">{{ item.name }}</span>
              <template v-if="i !== 0">
                <!-- x先根据索引,控制那个显示 -->
                <!-- 在根据编辑状态切换显示隐藏 -->
                <!-- 告诉父组件删除那个频道 -->
              <van-icon @click="$emit('delChannel',item.id)" v-show="editing" class="btn" name="cross"></van-icon>
              </template>
            </van-grid-item>
          </van-grid>
        </div>
        <div class="channel">
          <div class="tit">
            可选频道:
            <van-grid class="van-hairline--left">
              <van-grid-item v-for="item in optionChannels" :key="item.id">
                <span class="f12">{{ item.name }}</span>
                <van-icon @click="$emit('addChannel',item)" v-show="editing" class="btn" name="plus"></van-icon>
              </van-grid-item>
            </van-grid>
          </div>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channel'
export default {
  name: 'channel-edit',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    channels: {
      type: Array,
      // 用一个函数来声明数组类型,所以用箭头函数
      // eslint 要求default 必须是一个函数
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  computed: {
    optionChannels () {
      // 可选频道（计算属性） = 全部频道 - 我的频道
      // 减法逻辑：
      // 1. 先遍历全部频道，拿着当前遍历的频道的ID，去我的频道中查找有没有相同ID的频道
      // 2. 查到了相同的频道ID  排除不要
      // 3. 查询不到频道的ID  这就是可选频道  追加到新数组中即可
      // Array.filter() 根据原有的数组，进行遍历，根据条件（回调函数返回值true|false）追加选项到新数组中。
      return this.allChannels.filter(item => {
        return this.channels.findIndex(myItem => myItem.id === item.id) === -1
      })
    }
  },
  data () {
    return {
      editing: false,
      allChannels: []
    }
  },
  created () {
    this.getAllChannels()
  },
  methods: {
    async getAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels
    },
    enterChannel (index) {
      this.$emit('input', false)
      this.$emit('update', index)
    }
  }
}
</script>

<style lang="less" scoped>
.van-popup--bottom {
  &.van-popup--round {
    border-radius: 0;
  }
}
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
.channel {
  padding: 10px;
  .tit {
    line-height: 3;
    .tip {
      font-size: 10px;
      color: #999;
    }
  }
  .van-button {
    float: right;
    margin-top: 7px;
  }
  .btn {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #ddd;
    font-size: 12px;
    color: #fff;
  }
  .f12 {
    font-size: 12px;
    color: #555;
  }
  .red {
    color: red;
  }
}
</style>
