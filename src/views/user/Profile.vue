<template>
  <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存"></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="user.photo"
          @click="showPhoto = true"
        />
      </van-cell>
      <van-cell is-link title="名称" :value="user.name" @click="showName = true" />
      <van-cell is-link title="性别" :value= 'user.gender===0?"男":"女"' @click="showGender = true" />
      <van-cell is-link title="生日" :value="user.birthday" @click="showData" />
    </van-cell-group>
    <!-- 弹出组件 -->
    <van-popup v-model="showPhoto" style="width:80%" >
      <!-- 内容 -->
      <van-cell>本地相册选择图片</van-cell>
      <van-cell>拍照</van-cell>
    </van-popup>
    <!-- 换昵称弹层 -->
    <!-- :close-on-click-overlay='false' 关闭点击背景关闭弹层的功能 -->
    <van-popup v-model.trim="showName" style="width:80%" :round="true" :close-on-click-overlay='false'>
      <!-- 编辑用户昵称 -->
      <!-- 双向绑定用户昵称 -->
      <!-- 控制昵称长度为1-7 -->
      <van-field type="textarea" rows="4" v-model="user.name" :error-message="nameMsg" ></van-field>
      <van-button size="large" type='info' @click="btnName">确定</van-button>
    </van-popup>

    <!-- 性别选择的弹层 -->

    <van-action-sheet cancel-text="取消" :actions="action" v-model="showGender" @select="selectItem" ></van-action-sheet>
    <!--  选择出生日期 -->
    <van-popup v-model="showBirthday" position="bottom">
      <!--  出生日期应该小于现在的时间 -->
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        :min-date="minDate"
        :max-date="maxDate"
        @cacel="showBirthday = false"
        @confirm ='confirmDate'

      />
    </van-popup>
  </div>
</template>

<script>
import dayjs from 'dayjs' // 引入时间插件
import { getUserProfile } from '@/api/user'
export default {
  name: 'user-profile',
  data () {
    return {
      // 最小时间
      minDate: new Date(1900, 1, 1),
      // 最大时间 用于小于当前的时间
      maxDate: new Date(),
      // 当前时间
      currentDate: new Date(),
      showPhoto: false, // 说否选择头像弹层
      showName: false,
      showGender: false, // 是否显示性别选择的弹层
      showBirthday: false, // 是否显示生日弹层
      action: [{ name: '男' }, { name: '女' }], // 性别数据
      user: {
        // 用户数据
        name: '', // 用户名称
        gender: 0, // 0男 1女
        birthday: '' // 默认给一个生日
      },
      nameMsg: '' // 专门来控制显示的错误信息
    }
  },
  methods: {
    btnName () {
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        // 表示这个昵称不符合标准
        this.nameMsg = '您的昵称不满足:1-7位的要求'
        return false
      }
      // 如果满足就会继续执行
      this.nameMsg = '' // 提示消息情空
      this.showName = false
    },
    selectItem (item) {
      console.log(item)

      this.user.gender = item.name === '男' ? 0 : 1
      this.showGender = false
    },
    showData () {
      // 点击生日的时候触发
      this.currentDate = new Date(this.user.birthday)

      this.showBirthday = true
    },
    confirmDate (date) {
      // 点击生日弹层的确定时,调用的方法

      this.user.birthday = dayjs(date).format('YYYY-MM-DD') // 将转化后的结果赋值给 user 中的生日

      this.showBirthday = false
    },
    async getUserProfile () {
      let data = await getUserProfile()
      this.user = data
    }
  },
  created () {
    this.getUserProfile()
  }
}
</script>

<style scoped lang='less'></style>
