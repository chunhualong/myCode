<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  onShow: (res) => {
    console.log(res)
  }
}
</script>

<style>
  view.userImg{
    width: 220rpx;
    height: 220rpx;
    border-radius: 100%;
  }
.container {
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
  page{
    height: 100%;
  }
</style>
