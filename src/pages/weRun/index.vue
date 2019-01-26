<template>
  <div class="content">
    <div v-for="item in runList">
      运动时间:{{item.timestamp}} 运动步数：{{item.step}}
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        runList: []
      }
    },
    methods: {
      getRun () {
        let that = this
        wx.getWeRunData({
          success (res) {
            let userId
            let thatRes = res
            /* 调用解密data */
            wx.getStorage({
              key: 'id',
              success: (res) => {
                userId = res.data
                console.log(userId)
                that.$http('/completeInfo', 'POST', {
                  iv: thatRes.iv,
                  encryptedData: thatRes.encryptedData,
                  id: userId
                }, (res) => {
                  that.runList = res.data.list
                })
              }
            })
          },
          fail (error) {
            console.log(error)
          }
        })
      }
    },
    onShow () {
      this.getRun()
    }
  }
</script>

<style scoped>
  .content{
    box-sizing: border-box;
    height: 100%;
    padding: 50rpx 0;
    overflow: auto;
  }
</style>
