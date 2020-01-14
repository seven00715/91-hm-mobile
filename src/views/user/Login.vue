<template>
  <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="登录"></van-nav-bar>

    <!--  登录表单  手机号 验证码 登录按钮-->
    <van-cell-group>
      <!-- s手机号 -->
      <van-field
      v-model="userForm.mobile"
      required
      label="手机号"
      placeholder="请输入手机号"
      @blur="vaildMobile"
      :error-message='errMsg.mobile'
       />
       <!-- 验证码 -->
      <van-field
        v-model="userForm.code"
        required
        center
        clearable
        label="验证码"
        placeholder="请输入短信验证码"
        @blur="vaildCode"
        :error-message='errMsg.code'
      >
      <!-- 验证码 -->
      <van-button class="p5" slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="btn_box">
      <van-button round type="info" @click="login">登录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '../../api/user'
import { mapMutations } from 'vuex'

export default {
  name: 'user-chat',
  data () {
    return {
      userForm: {
        mobile: '13911111111',
        code: '246810'
      },
      errMsg: {
        mobile: '',
        code: ''
      }

    }
  },
  methods: {
    vaildMobile () {
      const value = this.userForm.mobile
      if (!value) {
        this.errMsg.mobile = '请输入手机号'
        return false
      } else if (!/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(value)) {
        this.errMsg.mobile = '手机号格式不正确'
        return false
      } else {
        this.errMsg.mobile = ''
        return true
      }
    },
    vaildCode () {
      const value = this.userForm.code
      if (!value) {
        this.errMsg.code = '请输入验证码'
        return false
      } else if (!/^\d{6}$/.test(value)) {
        this.errMsg.code = '验证码6位数字'
        return false
      } else {
        this.errMsg.code = ''
        return true
      }
    },
    ...mapMutations(['updated']),
    async login () {
      // this.vaildMobile()
      // this.vaildCode()
      // if (this.errMsg.mobile || this.errMsg.code) return false

      // 登录
      // if (!this.errMsg.mobile & !this.errMsg.code) {
      //   try {
      //     const data = await login(this.userForm)
      //     this.updated(data)
      //     this.$router.push(this.$route.query.redirectUrl || '/user')
      //     this.$toast.success('登录成功')
      //   } catch (e) {
      //     // console.log(e)
      //     this.$toast.fail('用户名密码错误')
      //   }
      // }
      if (this.vaildMobile() && this.vaildCode()) {
        const data = await login(this.userForm)
        // 拿到了token 更新token
        // this.$store.commit('update', { user: data })
        this.updated(data)
        this.$notify({ type: 'success', message: '登录成功' })
        // this.$router.push('/user')
        // let { redirectUrl } = this.$route.query // 解构当前的路由信息

        this.$router.push(this.$route.query.redirectUrl || '/') // 短路表达式

        // 未通过返回值是false ,通过表示格式正确
      }
    }
    // async login () {
    //   if (this.vaildMobile() && this.vaildCode()) {
    //     // 都通过了 表示前端校验通过 还要调用接口
    //     // 提示消息 表示登录成功
    //     const data = await login(this.userForm) // 获取结果
    //     // 拿到了token 更新token信息
    //     // this.$store.commit('updateUser', { user: data }) // 第一种写法\
    //     console.log(data)

    //     this.updated(data) // 更新用户信息
    //     // 登录成功
    //     this.$notify({ type: 'success', message: '登录成功' })
    //     // 跳转
    //     // 两种情况 1 redirectUrl (登录未遂 => 登录  => 遂) 2 没有 redirectUrl 跳到首页
    //     let { redirectUrl } = this.$route.query // 解构当前的路由信息
    //     this.$router.push(redirectUrl || '/') // 短路表达式
    //   }
    // }
  }
}
</script>

<style scoped lang='less'>
.p5{
  padding: 0 5px;
}
.btn_box{
  padding: 10px 0;
  width: 100%;
  text-align: center;
  .van-button{
    height: 32px;
    line-height: 30px;
    width: 90%;
  }
}</style>
