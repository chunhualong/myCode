<template>
  <div class="container">
    <div class="userinfo" @click="bindViewTap">
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
      <div class="userinfo-nickname">
        <card :text="userInfo.nickName"></card>
      </div>
      <div>
        <a href="/pages/weRun/main">去往我的运动足迹</a>
      </div>
    </div>
  </div>
</template>

<script>
import card from '@/components/card'

export default {
  data () {
    return {
      motto: 'Hello World',
      userInfo: {}
    }
  },

  components: {
    card
  },

  methods: {
    bindViewTap () {
      const url = '../logs/main'
      wx.navigateTo({ url })
    },
    getUser (is) {
      // 调用登录接口
      wx.login({
        success: (res) => {
          console.log(res)
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
            }
          })
          this.$http('/login', 'POST', {
            code: res.code,
            sava: is
          }, (res) => {
            wx.setStorage({
              key: 'id',
              data: res.data.userId
            })
          })
        }
      })
    }
  },

  created () {
    let that = this
    // 调用应用实例的方法获取全局数据
    // 检测是否失效
    wx.checkSession({
      success: () => {
        console.log('mei')
        that.getUser(false)
      },
      fail () {
        console.log(this)
        that.getUser(true)
      }
    })
  }
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}
</style>
