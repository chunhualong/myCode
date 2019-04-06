<script src="../../utils/index.js"></script>
<template>
  <div class="container">
    <div v-if="visible">
      <div style="display: flex;align-content: center;justify-content: center">
        <i-avatar i-class="userImg" size="large"  shape="square">
          <open-data type="userAvatarUrl"></open-data>
        </i-avatar>
      </div>
      <div style="text-align: center;color: #999;font-size: 14px;padding: 20rpx;">
        <open-data type="userNickName"></open-data>
      </div>
      <i-cell-group>
        <i-cell title="我的运动足迹" url="/pages/weRun/main" is-link></i-cell>
        <i-cell title="查看我的位置" url="/pages/map/main" is-link></i-cell>
        <i-cell title="进入答题" url="/pages/answer/main" is-link></i-cell>
      </i-cell-group>
      <!--<i-button type="primary" @click="forward">转发</i-button>-->
      <!--<i-button open-type="share">分享</i-button>-->
    </div>
    <div v-if="!visible">
      <i-button @getuserinfo="bindGetUserInfo" open-type="getUserInfo">获取我的信息</i-button>
    </div>
  </div>
</template>

<script>
import card from '@/components/card'
export default {
  data () {
    return {
      motto: 'Hello World',
      userInfo: {},
      visible: false
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
              this.userInfo = res.userInfo
              wx.setStorage({
                key: 'userName',
                data: res.userInfo.nickName
              })
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
    },
    forward () {
      console.log('111')
      this.$http('/api/activityId', 'GET', {}, (res) => {
        console.log(res.data)
        wx.updateShareMenu({
          withShareTicket: true,
          isUpdatableMessage: true,
          activityId: res.data.activity_id, // 活动 ID
          templateInfo: {
            parameterList: [{
              name: 'member_count',
              value: '1'
            }, {
              name: 'room_limit',
              value: '3'
            }]
          }
        })
      })
    },
    bindGetUserInfo () {
      this.visible = true
    }
  },
  mounted () {
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
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.getSetting({
      success (res) {
        if (res.authSetting['scope.userInfo']) {
          that.visible = true
        }
      }
    })
  },
  /**
   * 转发
   * @param res
   * @returns {{title: string, path: string}}
   */
  onShareAppMessage (res) {
    // console.log(res)
    return {
      title: 'aa',
      path: '/pages/index/main?data=1'
    }
  },
  onShow (options) {
    // console.log(options)
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
