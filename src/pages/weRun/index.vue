<template>
    <div v-for="item in runList">
      运动时间:{{item.timestamp}} 运动步数：{{item.step}}
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
        wx.getWeRunData({
          success (res) {
            console.log(res.encryptedData)
            /* 调用解密data */
            wx.request({
              url: 'http://127.0.0.1:8081/completeInfo',
              method: 'POST',
              data: {
                iv: res.iv,
                encryptedData: res.encryptedData
              },
              success (res) {
                console.log(this.runList)
                this.runList = res.data.list
              }
            })
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

</style>
