<script src="../../utils/index.js"></script>
<template>
  <div class="container">
    <div style="display: flex;align-content: center;justify-content: center">
      <i-avatar i-class="userImg" size="large" :src="userInfo.avatarUrl" shape="square"></i-avatar>
    </div>
    <div style="text-align: center;color: #999;font-size: 14px;padding: 20rpx">
      <open-data type="userNickName"></open-data>
    </div>
    <i-cell-group>
      <i-cell title="我的运动足迹" url="/pages/weRun/main" is-link></i-cell>
      <i-cell title="查看我的位置" url="/pages/map/main" is-link></i-cell>
    </i-cell-group>
    <i-button open-type="getUserInfo">获取我的信息</i-button>
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
          // 小程序用户信息
          wx.getUserInfo({
            success: (res) => {
              console.log(res.userInfo.avatarUrl)
              this.userInfo = res.userInfo
            }
          })
          // 自定义用户信息
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
        that.getUser(false)
      },
      fail () {
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
